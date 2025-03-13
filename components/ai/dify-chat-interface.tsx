"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Bot, StopCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChatMessageItem } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "@/lib/ai/types";
import { createDifyChatMessage, DIFY_SYSTEM_PROMPT, chatHistoryToDifyQuery } from "@/lib/ai/dify-utils";
import { toast } from "sonner";
import { ThinkContent } from "./think-content";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DifyChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createDifyChatMessage("system", DIFY_SYSTEM_PROMPT),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [showThinking, setShowThinking] = useState(true); // 控制是否显示思考过程
  const [isThinking, setIsThinking] = useState(false); // 标记是否在思考过程中
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
    const userMessage = createDifyChatMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true); // 使用 streaming 模式
    setStreamedContent("");

    try {
      // 准备请求数据
      const requestData = {
        inputs: {
          query: chatHistoryToDifyQuery(messages, content)
        },
        response_mode: "streaming", // 使用 streaming 模式
        user: "zhangxudong"
      };

      // 创建 AbortController 用于取消请求
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // 发送请求到 API
      const response = await fetch("/api/ai/dify", {
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

      // 处理流式响应
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = ""; // 用于存储不完整的行
        let localIsThinking = false; // 本地变量，标记是否在思考过程中

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 解码当前块并与之前的缓冲区合并
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // 按行分割并处理完整的行
            const lines = buffer.split('\n');
            // 保留最后一行（可能不完整）作为新的缓冲区
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine) continue;
              
              // SSE 格式以 "data: " 开头
              if (trimmedLine.startsWith('data: ')) {
                const data = trimmedLine.substring(6);
                
                // 检查是否是结束标记
                if (data === '[DONE]') {
                  continue;
                }
                
                try {
                  // 解析 JSON 数据
                  const eventData = JSON.parse(data);
                  
                  // 根据事件类型处理
                  if (eventData.event === 'message') {
                    const content = eventData.answer || "";
                    
                    // 检查是否是思考过程的开始
                    if (content.includes("> 💭") && !localIsThinking) {
                      localIsThinking = true;
                      setIsThinking(true); // 更新组件状态
                      // 直接累积内容，不添加 <think> 标签
                      fullContent += content;
                    } 
                    // 检查是否是思考过程的结束
                    else if (content.includes("\n>") && localIsThinking) {
                      localIsThinking = false;
                      setIsThinking(false); // 更新组件状态
                      // 直接累积内容，不添加 </think> 标签
                      fullContent += content;
                    }
                    // 正常内容累积
                    else {
                      fullContent += content;
                    }
                    
                    setStreamedContent(fullContent);
                  } else if (eventData.event === 'message_replace') {
                    // message_replace 事件应该替换全部内容
                    const content = eventData.answer || "";
                    
                    // 检查替换内容是否包含思考过程
                    if (content.includes("> 💭")) {
                      // 检查是否同时包含思考过程的开始和结束
                      if (content.includes("\n>")) {
                        // 包含完整的思考过程，直接使用内容
                        fullContent = content;
                        localIsThinking = false;
                        setIsThinking(false); // 更新组件状态
                      } else {
                        // 只包含思考开始，没有结束
                        fullContent = content;
                        localIsThinking = true;
                        setIsThinking(true); // 更新组件状态
                      }
                    } else if (content.includes("\n>") && localIsThinking) {
                      // 包含思考结束，但没有开始（之前已经开始了）
                      fullContent = content;
                      localIsThinking = false;
                      setIsThinking(false); // 更新组件状态
                    } else {
                      // 不包含思考过程标记
                      fullContent = content;
                      localIsThinking = false;
                      setIsThinking(false); // 更新组件状态
                    }
                    
                    setStreamedContent(fullContent);
                  } else if (eventData.event === 'message_end') {
                    // 流式响应结束，添加完整消息
                    if (fullContent.trim()) {
                      const assistantMessage = createDifyChatMessage("assistant", fullContent);
                      setMessages((prev) => [...prev, assistantMessage]);
                    }
                    setIsStreaming(false);
                    setStreamedContent("");
                    setIsThinking(false); // 重置思考状态
                    
                    // 记录使用统计信息
                    if (eventData.metadata && eventData.usage) {
                      console.log('响应统计信息:', eventData.usage);
                    }
                  } else if (eventData.event === 'error') {
                    throw new Error(eventData.message || "流式响应错误");
                  }
                } catch (parseError) {
                  console.error("解析 SSE 数据错误:", parseError, "原始数据:", data);
                  // 继续处理，不要中断流
                }
              }
            }
          }
          
          // 处理最后可能剩余的缓冲区
          if (buffer.trim()) {
            const trimmedBuffer = buffer.trim();
            if (trimmedBuffer.startsWith('data: ')) {
              const data = trimmedBuffer.substring(6);
              if (data !== '[DONE]') {
                try {
                  const eventData = JSON.parse(data);
                  if (eventData.event === 'message') {
                    const content = eventData.answer || "";
                    
                    // 处理最后一块数据中可能的思考过程
                    if (localIsThinking && content.includes("\n>")) {
                      // 思考过程结束
                      localIsThinking = false;
                      setIsThinking(false); // 更新组件状态
                      fullContent += content;
                    } else if (content.includes("> 💭") && !localIsThinking) {
                      // 思考过程开始
                      localIsThinking = true;
                      setIsThinking(true); // 更新组件状态
                      fullContent += content;
                    } else {
                      // 普通内容
                      fullContent += content;
                    }
                    
                    setStreamedContent(fullContent);
                  } else if (eventData.event === 'message_replace') {
                    const content = eventData.answer || "";
                    
                    // 检查替换内容是否包含思考过程
                    if (content.includes("> 💭")) {
                      // 检查是否同时包含思考过程的开始和结束
                      if (content.includes("\n>")) {
                        // 包含完整的思考过程，直接使用内容
                        fullContent = content;
                        localIsThinking = false;
                        setIsThinking(false); // 更新组件状态
                      } else {
                        // 只包含思考开始，没有结束
                        fullContent = content;
                        localIsThinking = true;
                        setIsThinking(true); // 更新组件状态
                      }
                    } else if (content.includes("\n>") && localIsThinking) {
                      // 包含思考结束，但没有开始（之前已经开始了）
                      fullContent = content;
                      localIsThinking = false;
                      setIsThinking(false); // 更新组件状态
                    } else {
                      // 不包含思考过程标记
                      fullContent = content;
                      localIsThinking = false;
                      setIsThinking(false); // 更新组件状态
                    }
                    
                    setStreamedContent(fullContent);
                  }
                } catch (e) {
                  console.error("解析最终缓冲区错误:", e);
                }
              }
            }
          }
          
          // 如果流结束但没有收到 message_end 事件，也添加消息
          if (fullContent.trim() && isStreaming) {
            // 不需要添加结束标签，ThinkContent 组件会处理
            const assistantMessage = createDifyChatMessage("assistant", fullContent);
            setMessages((prev) => [...prev, assistantMessage]);
            setIsStreaming(false);
            setStreamedContent("");
            setIsThinking(false); // 重置思考状态
          }
        } catch (streamError) {
          // 如果是用户主动取消，不显示错误
          if (signal.aborted) {
            // 将已经流式输出的内容作为最终回答
            if (streamedContent) {
              const assistantMessage = createDifyChatMessage("assistant", streamedContent);
              setMessages((prev) => [...prev, assistantMessage]);
            }
            return;
          }
          
          throw streamError;
        }
      } else {
        throw new Error("无法获取响应流");
      }
    } catch (error) {
      console.error("发送消息错误:", error);
      toast.error(error instanceof Error ? error.message : "发送消息失败");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamedContent("");
      setIsThinking(false); // 重置思考状态
      abortControllerRef.current = null;
    }
  };

  // 重置对话
  const resetConversation = () => {
    // 如果正在加载或流式输出，先停止
    if (isStreaming) {
      stopStreaming();
    }
    
    // 重置消息列表，只保留系统提示
    setMessages([
      createDifyChatMessage("system", DIFY_SYSTEM_PROMPT),
    ]);
    
    // 重置状态
    setIsLoading(false);
    setIsStreaming(false);
    setStreamedContent("");
    setIsThinking(false); // 重置思考状态
    
    toast.success("对话已重置");
  };

  return (
    <Card className="w-full flex flex-col h-[calc(100vh-12rem)]">
      <CardHeader className="p-3 sm:p-4 pb-0 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">DeepSeek R1 对话</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <Switch
                id="show-thinking"
                checked={showThinking}
                onCheckedChange={setShowThinking}
              />
              <Label htmlFor="show-thinking" className="text-xs sm:text-sm cursor-pointer">
                {showThinking ? (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>显示思考过程</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>隐藏思考过程</span>
                  </span>
                )}
              </Label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetConversation}
              className="flex items-center gap-1"
              disabled={isLoading && !isStreaming}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>新对话</span>
            </Button>
            <div className="text-xs sm:text-sm text-muted-foreground">
              使用 Dify API 的 DeepSeek R1 模型
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator className="my-3 sm:my-4" />
      <CardContent className="p-3 sm:p-4 pt-0 flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 sm:pr-4 pb-4">
          {messages.length === 1 && !streamedContent && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-primary/50" />
              <h3 className="text-base sm:text-lg font-medium mb-2">DeepSeek R1 对话助手</h3>
              <p className="text-sm sm:text-base max-w-md px-2 sm:px-0">
                输入您的问题，AI 将为您提供回答。您可以询问任何问题，包括编程、知识查询、创意写作等。
              </p>
            </div>
          )}
          {messages
            .filter((msg) => msg.role !== "system")
            .map((message) => (
              <ChatMessageItem key={message.id} message={message} showThinking={showThinking} />
            ))}
          
          {/* 流式输出的临时消息 */}
          {streamedContent && (
            <div className="flex gap-2 sm:gap-3 my-4 sm:my-6 group justify-start">
              <div className="h-8 w-8 mt-1 flex-shrink-0">
                <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              </div>
              <div className="flex flex-col max-w-[85%] sm:max-w-[80%]">
                <Card className="bg-muted">
                  <CardContent className="p-2 sm:p-3 prose prose-sm dark:prose-invert max-w-none">
                    {showThinking ? (
                      <ThinkContent content={streamedContent} showThinking={true} />
                    ) : (
                      <>
                        {isThinking ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>AI 正在思考中...</span>
                          </div>
                        ) : (
                          <ThinkContent content={streamedContent} showThinking={false} />
                        )}
                      </>
                    )}
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
      <CardFooter className="p-3 sm:p-4 pt-2 flex-shrink-0 border-t">
        <div className="w-full">
          {isStreaming && (
            <div className="flex justify-center mb-3 sm:mb-4">
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