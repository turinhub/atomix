"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { type Message } from "@langchain/langgraph-sdk";
import { v4 as uuidv4 } from "uuid";

export interface StreamState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  threadId: string | null;
  submit: (messages: Message[], opts?: { threadId?: string }) => void;
  stop: () => void;
  setThreadId: (id: string | null) => void;
}

const StreamContext = createContext<StreamState | undefined>(undefined);

export function useLangGraphStream(): StreamState {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useLangGraphStream 必须在 LangGraphStreamProvider 内使用");
  }
  return context;
}

export function LangGraphStreamProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadIdState] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const setThreadId = useCallback((id: string | null) => {
    setThreadIdState(id);
    setMessages([]);
    setError(null);
  }, []);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const submit = useCallback(
    (newMessages: Message[], opts?: { threadId?: string }) => {
      const currentAbort = abortControllerRef.current;
      if (currentAbort) {
        currentAbort.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      const resolvedThreadId = opts?.threadId || threadId;

      // 乐观更新：立即显示用户消息
      setMessages(prev => {
        const existing = resolvedThreadId ? prev : [];
        return [...existing, ...newMessages];
      });

      const body = {
        messages: newMessages.map(m => ({
          type: m.type,
          content:
            typeof m.content === "string"
              ? m.content
              : Array.isArray(m.content)
                ? m.content
                : String(m.content ?? ""),
        })),
        threadId: resolvedThreadId,
      };

      fetch("/api/langgraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
        .then(async response => {
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(
              ((errData as Record<string, unknown>).error as string) ||
                `请求失败: ${response.status}`
            );
          }

          const reader = response.body?.getReader();
          if (!reader) throw new Error("无法读取响应流");

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            let currentEvent = "";

            for (const line of lines) {
              if (line.startsWith("event: ")) {
                currentEvent = line.slice(7).trim();
              } else if (line.startsWith("data: ")) {
                const data = line.slice(6);
                try {
                  const parsed = JSON.parse(data);

                  if (currentEvent === "metadata" && parsed.threadId) {
                    setThreadIdState(parsed.threadId);
                  } else if (currentEvent === "values") {
                    // 用服务端的完整消息列表替换
                    setMessages(parsed.messages || []);
                  } else if (currentEvent === "error") {
                    setError(
                      ((parsed as Record<string, unknown>).error as string) ||
                        "未知错误"
                    );
                  }
                } catch {
                  // 忽略解析错误
                }
                currentEvent = "";
              }
            }
          }
        })
        .catch(err => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setError(err instanceof Error ? err.message : "未知错误");
        })
        .finally(() => {
          setIsLoading(false);
          abortControllerRef.current = null;
        });
    },
    [threadId]
  );

  return (
    <StreamContext.Provider
      value={{
        messages,
        isLoading,
        error,
        threadId,
        submit,
        stop,
        setThreadId,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
