"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Bot,
  User,
  Copy,
  Trash2,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Send,
  Loader2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "./markdown-renderer";
import { cn } from "@/lib/utils";

// ── 常量 ──────────────────────────────────────────────

const STORAGE_KEY = "ai-chat-messages-v2";
const LEGACY_STORAGE_KEY = "ai-chat-messages";

const welcomeQuickReplies = [
  {
    title: "解释一个概念",
    prompt: "请用通俗易懂的方式解释这个概念，并给出一个简单例子",
  },
  {
    title: "帮我整理思路",
    prompt: "请根据我的问题帮我梳理思路，给出分步骤建议",
  },
  {
    title: "总结重点内容",
    prompt: "请帮我总结重点，并整理成简明清单",
  },
];

// ── 工具函数 ──────────────────────────────────────────

function getTextContent(message: UIMessage) {
  return message.parts
    .filter(
      (
        part
      ): part is Extract<(typeof message.parts)[number], { type: "text" }> =>
        part.type === "text"
    )
    .map(part => part.text)
    .join("");
}

function sanitizeFilenamePart(value: string) {
  return value.replaceAll(/[/:]/g, "-");
}

function isStoredChatState(value: unknown): value is {
  messages: UIMessage[];
  timestamps: Record<string, string>;
} {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { messages?: unknown; timestamps?: unknown };
  return (
    Array.isArray(candidate.messages) &&
    typeof candidate.timestamps === "object"
  );
}

function isUIMessageArray(value: unknown): value is UIMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      m =>
        Boolean(m) &&
        typeof m === "object" &&
        "id" in m &&
        "role" in m &&
        "parts" in m
    )
  );
}

// ── 局部组件：单条消息 ─────────────────────────────────

function MessageItem({
  message,
  onCopy,
  onDelete,
  isStreaming,
}: {
  message: UIMessage;
  onCopy: (content: string) => void;
  onDelete: (id: string) => void;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const isError = message.parts.some(
    p => p.type === "text" && p.text.includes("抱歉，我现在无法回应")
  );
  const content = getTextContent(message);

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-xl border p-4 transition-colors",
        isUser
          ? "border-border bg-muted/40"
          : isError
            ? "border-destructive/20 bg-destructive/5"
            : "border-border bg-background"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-sm font-medium",
            isUser
              ? "bg-primary text-primary-foreground"
              : isError
                ? "bg-destructive text-destructive-foreground"
                : "bg-muted-foreground text-muted"
          )}
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {isUser ? "用户" : "AI助手"}
          </span>
          {isError && (
            <Badge variant="destructive" className="text-xs">
              错误
            </Badge>
          )}
        </div>
        <div className="text-sm leading-relaxed">
          {content ? (
            <>
              <MarkdownRenderer content={content} />
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
              )}
            </>
          ) : isStreaming ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>正在生成回复...</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopy(content)}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(message.id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// ── 局部组件：输入框 ───────────────────────────────────

function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    onSend(text);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-4 rounded-xl border bg-background p-2">
      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题，按 Enter 发送，Shift + Enter 换行"
          className="min-h-[56px] max-h-[180px] flex-1 resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="h-9 w-9 shrink-0 self-end rounded-lg"
          aria-label="发送消息"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ── 主组件 ─────────────────────────────────────────────

export function ChatPage() {
  const initializedRef = useRef(false);
  const [messageTimestamps, setMessageTimestamps] = useState<
    Record<string, string>
  >({});

  const { messages, status, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai-chat" }),
    onError: error => {
      toast.error(error.message || "对话请求失败，请稍后再试");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";
  const isSubmitting = status === "submitted";
  const isStreaming = status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 恢复 localStorage（仅首次挂载）
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const oldData = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (oldData) localStorage.removeItem(LEGACY_STORAGE_KEY);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          isStoredChatState(parsed) &&
          isUIMessageArray(parsed.messages) &&
          parsed.messages.length > 0
        ) {
          setMessages(parsed.messages);
          setMessageTimestamps(parsed.timestamps ?? {});
        } else if (isUIMessageArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setMessageTimestamps(
            Object.fromEntries(
              parsed.map(m => [m.id, new Date().toISOString()])
            )
          );
        }
      } catch (e) {
        console.error("加载对话历史失败:", e);
      }
    }
  }, [setMessages]);

  // 保存到 localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, timestamps: messageTimestamps })
      );
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }, [messages, messageTimestamps]);

  // 同步时间戳
  useEffect(() => {
    if (messages.length === 0) return;
    const now = new Date().toISOString();
    let hasChanges = false;

    setMessageTimestamps(prev => {
      const next = { ...prev };
      for (const m of messages) {
        if (!next[m.id]) {
          next[m.id] = now;
          hasChanges = true;
        }
      }
      for (const id of Object.keys(next)) {
        if (!messages.some(m => m.id === id)) {
          delete next[id];
          hasChanges = true;
        }
      }
      return hasChanges ? next : prev;
    });
  }, [messages]);

  // ── 操作函数 ────────────────────────────────────────

  const handleSend = (text: string) => sendMessage({ text });

  const handleReset = () => {
    setMessages([]);
    setMessageTimestamps({});
    localStorage.removeItem(STORAGE_KEY);
    toast.success("对话已重置");
  };

  const handleExport = () => {
    const chatText = messages
      .map(msg => {
        const role = msg.role === "user" ? "用户" : "AI助手";
        const content = getTextContent(msg);
        const displayTime = messageTimestamps[msg.id]
          ? new Date(messageTimestamps[msg.id]).toLocaleString()
          : "时间未知";
        return `[${displayTime}] ${role}: ${content}`;
      })
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI对话记录_${sanitizeFilenamePart(new Date().toLocaleString())}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("对话记录已导出");
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("消息已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  };

  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setMessageTimestamps(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    toast.success("消息已删除");
  };

  const lastAssistantId =
    [...messages].reverse().find(m => m.role === "assistant")?.id ?? null;

  // ── 渲染 ────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="container mx-auto py-6">
        <Card className="mx-auto w-full max-w-4xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bot className="h-5 w-5 text-primary" />
                  AI 对话助手
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm">
                  直接输入问题即可开始对话。
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  Qwen Flash
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-xs"
                >
                  {messages.length} 条消息
                </Badge>
                {messages.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-1 h-4 w-4" />
                    导出记录
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {messages.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">开始一段新对话</h3>
                  <p className="text-sm text-muted-foreground">
                    直接输入问题，或选择一个示例提示词。
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {welcomeQuickReplies.map(item => (
                    <Button
                      key={item.title}
                      type="button"
                      variant="outline"
                      onClick={() => handleSend(item.prompt)}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  示例：帮我写一封邮件、解释一个术语、总结这段内容
                </p>
              </div>
            ) : (
              <div className="rounded-xl border bg-background p-3">
                <ScrollArea className="h-[min(62vh,680px)] w-full pr-3">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <MessageItem
                        key={message.id}
                        message={message}
                        onCopy={handleCopy}
                        onDelete={handleDelete}
                        isStreaming={
                          isStreaming &&
                          message.id === lastAssistantId &&
                          message.role === "assistant"
                        }
                      />
                    ))}

                    {isSubmitting && (
                      <div className="flex gap-3 rounded-xl border bg-background p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground text-muted">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-medium">AI助手</span>
                            <span className="text-xs text-muted-foreground">
                              正在思考...
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>正在生成回复...</span>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            <div
                              className="h-2 w-2 animate-pulse rounded-full bg-primary"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <div
                              className="h-2 w-2 animate-pulse rounded-full bg-primary"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </div>
            )}

            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              重置对话
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>对话内容已自动保存到本地</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
