"use client";

import { v4 as uuidv4 } from "uuid";
import { type ReactNode, useEffect, useRef } from "react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { useStreamContext } from "@/components/langgraph/providers/stream-provider";
import { Button } from "@/components/ui/button";
import { type Message } from "@langchain/langgraph-sdk";
import { AssistantMessage, AssistantMessageLoading } from "./messages/ai";
import { HumanMessage } from "./messages/human";
import { DO_NOT_RENDER_ID_PREFIX } from "@/lib/langgraph/ensure-tool-responses";
import { TooltipIconButton } from "./tooltip-icon-button";
import { ArrowDown, LoaderCircle, SquarePen } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const context = useStickToBottomContext();
  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={props.className}
    >
      <div ref={context.contentRef} className={props.contentClassName}>
        {props.content}
      </div>
      {props.footer}
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>滚动到底部</span>
    </Button>
  );
}

export function Thread() {
  const [input, setInput] = useState("");
  const [hideToolCalls, setHideToolCalls] = useState(false);
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

  const lastError = useRef<string | null>(null);

  useEffect(() => {
    if (!stream.error) {
      lastError.current = null;
      return;
    }
    const msg = String(stream.error);
    if (msg && lastError.current !== msg) {
      lastError.current = msg;
      toast.error("发生错误，请重试", {
        description: (
          <p>
            <strong>错误：</strong> <code>{msg}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    }
  }, [stream.error]);

  const prevMessageLength = useRef(0);
  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages.length > 0 &&
      messages[messages.length - 1].type === "ai"
    ) {
      setFirstTokenReceived(true);
    }
    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim().length === 0 || isLoading) return;
    setFirstTokenReceived(false);

    const newMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: input.trim(),
    };

    stream.submit([newMessage]);
    setInput("");
  };

  const handleNewThread = () => {
    stream.setThreadId(null);
    setFirstTokenReceived(false);
  };

  const chatStarted = !!stream.threadId || messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full overflow-hidden rounded-xl border bg-background">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        {chatStarted && (
          <div className="relative z-10 flex items-center justify-between gap-3 border-b p-2">
            <div className="flex items-center gap-2">
              <button
                className="flex cursor-pointer items-center gap-2"
                onClick={handleNewThread}
              >
                <span className="text-lg font-semibold tracking-tight">
                  Agent 对话
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <TooltipIconButton
                size="lg"
                className="p-3"
                tooltip="新对话"
                variant="ghost"
                onClick={handleNewThread}
              >
                <SquarePen className="size-5" />
              </TooltipIconButton>
            </div>
          </div>
        )}

        {/* 消息区域 */}
        <StickToBottom className="relative flex-1 overflow-hidden">
          <StickyToBottomContent
            className={cn(
              "absolute inset-0 overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent",
              !chatStarted && "mt-[15vh] flex flex-col items-stretch",
              chatStarted && "grid grid-rows-[1fr_auto]"
            )}
            contentClassName="pt-4 pb-16 max-w-3xl mx-auto flex flex-col gap-4 w-full"
            content={
              <>
                {messages
                  .filter(m => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
                  .filter(m => {
                    if (hideToolCalls && m.type === "tool") return false;
                    return true;
                  })
                  .map((message, index) =>
                    message.type === "human" ? (
                      <HumanMessage
                        key={message.id || `${message.type}-${index}`}
                        message={message}
                        isLoading={isLoading}
                      />
                    ) : (
                      <AssistantMessage
                        key={message.id || `${message.type}-${index}`}
                        message={message}
                        isLoading={isLoading}
                      />
                    )
                  )}
                {isLoading && !firstTokenReceived && (
                  <AssistantMessageLoading />
                )}
              </>
            }
            footer={
              <div className="sticky bottom-0 flex flex-col items-center gap-4 bg-background">
                {!chatStarted && (
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Agent 对话
                    </h1>
                  </div>
                )}

                <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />

                <div className="bg-muted relative z-10 mx-auto mb-6 w-full max-w-3xl rounded-2xl border shadow-xs">
                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2"
                  >
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          !e.metaKey &&
                          !e.nativeEvent.isComposing
                        ) {
                          e.preventDefault();
                          const el = e.target as HTMLElement | undefined;
                          el?.closest("form")?.requestSubmit();
                        }
                      }}
                      placeholder="输入消息..."
                      className="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                    />
                    <div className="flex items-center gap-4 p-2 pt-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="hide-tool-calls"
                          checked={hideToolCalls}
                          onCheckedChange={setHideToolCalls}
                        />
                        <Label
                          htmlFor="hide-tool-calls"
                          className="text-sm text-muted-foreground"
                        >
                          隐藏工具调用
                        </Label>
                      </div>
                      {stream.isLoading ? (
                        <Button
                          key="stop"
                          onClick={() => stream.stop()}
                          className="ml-auto"
                        >
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          取消
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto shadow-md transition-all"
                          disabled={isLoading || !input.trim()}
                        >
                          发送
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            }
          />
        </StickToBottom>
      </div>
    </div>
  );
}
