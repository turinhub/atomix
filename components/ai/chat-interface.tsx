"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Bot, StopCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChatMessageItem } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "@/lib/ai/types";
import { createChatMessage, DEFAULT_SYSTEM_PROMPT } from "@/lib/ai/utils";
import { toast } from "sonner";
import { ThinkContent } from "./think-content";

// 固定使用的模型
const FIXED_MODEL = "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b";

// 定义 DOMException 类型的接口
interface AbortError extends Error {
  name: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createChatMessage("system", DEFAULT_SYSTEM_PROMPT),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedContent]);

  // 停止流式输出
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    const userMessage = createChatMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);
    setStreamedContent("");

    try {
      // 准备请求数据
      const requestData = {
        model: FIXED_MODEL,
        messages: messages
          .concat(userMessage)
          .filter((msg) => msg.role !== "system" || msg === messages[0])
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        stream: true, // 启用流式输出
      };

      // 创建 AbortController 用于取消请求
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // 发送请求到 API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "请求失败");
      }

      if (!response.body) {
        throw new Error("响应体为空");
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          // 解码二进制数据
          const chunk = decoder.decode(value, { stream: true });
          
          // 处理 SSE 格式的数据
          const lines = chunk
            .split("\n")
            .filter((line) => line.trim() !== "" && line.startsWith("data: "));

          for (const line of lines) {
            const data = line.substring(6); // 移除 "data: " 前缀
            
            if (data === "[DONE]") {
              // 流式响应结束
              continue;
            }

            try {
              const parsedData = JSON.parse(data);
              const content = parsedData.content || "";
              
              // 累积内容
              accumulatedContent += content;
              setStreamedContent(accumulatedContent);
            } catch (error) {
              console.error("解析流式数据错误:", error);
            }
          }
        }
      } catch (error) {
        const err = error as AbortError;
        if (err.name === "AbortError") {
          console.log("流式响应被用户中断");
        } else {
          throw error;
        }
      } finally {
        // 流式响应结束，添加完整的助手消息
        if (accumulatedContent) {
          const assistantMessage = createChatMessage("assistant", accumulatedContent);
          setMessages((prev) => [...prev, assistantMessage]);
        }
        setIsStreaming(false);
        setStreamedContent("");
        abortControllerRef.current = null;
      }
    } catch (error) {
      console.error("发送消息错误:", error);
      toast.error(error instanceof Error ? error.message : "发送消息失败");
      setIsStreaming(false);
      setStreamedContent("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full flex flex-col h-[calc(100vh-12rem)]">
      <CardHeader className="p-4 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI 对话</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            使用 Deepseek Qwen 32B 模型
          </div>
        </div>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent className="p-4 pt-0 flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto pr-4 pb-4">
          {messages.length === 1 && !streamedContent && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-12 w-12 mb-4 text-primary/50" />
              <h3 className="text-lg font-medium mb-2">Deepseek Qwen 32B 对话助手</h3>
              <p className="max-w-md">
                输入您的问题，AI 将为您提供回答。您可以询问任何问题，包括编程、知识查询、创意写作等。
              </p>
            </div>
          )}
          {messages
            .filter((msg) => msg.role !== "system")
            .map((message) => (
              <ChatMessageItem key={message.id} message={message} />
            ))}
          
          {/* 流式输出的临时消息 */}
          {streamedContent && (
            <div className="flex gap-3 my-6 group justify-start">
              <div className="h-8 w-8 mt-1 flex-shrink-0">
                <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              </div>
              <div className="flex flex-col max-w-[80%]">
                <Card className="bg-muted">
                  <CardContent className="p-3 prose prose-sm dark:prose-invert max-w-none">
                    <ThinkContent content={streamedContent} />
                    <span className="animate-pulse inline-block ml-1">▋</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {isLoading && !isStreaming && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex-shrink-0 border-t">
        <div className="w-full">
          {isStreaming && (
            <div className="flex justify-center mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={stopStreaming}
                className="flex items-center gap-2"
              >
                <StopCircle className="h-4 w-4" />
                <span>停止生成</span>
              </Button>
            </div>
          )}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </CardFooter>
    </Card>
  );
} 