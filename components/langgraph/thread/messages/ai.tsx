"use client";

import { useStreamContext } from "@/components/langgraph/providers/stream-provider";
import { type Message } from "@langchain/langgraph-sdk";
import { getContentString } from "../utils";
import { CommandBar } from "./shared";
import { MarkdownText } from "../markdown-text";
import { cn } from "@/lib/utils";
import { ToolCalls, ToolResult } from "./tool-calls";

export function AssistantMessage({
  message,
  isLoading,
}: {
  message: Message | undefined;
  isLoading: boolean;
}) {
  const content = message?.content ?? [];
  const contentString = getContentString(content);

  const stream = useStreamContext();
  const isLastMessage =
    stream.messages.length > 0 &&
    stream.messages[stream.messages.length - 1].id === message?.id;

  const hasToolCalls =
    message &&
    "tool_calls" in message &&
    message.tool_calls &&
    Array.isArray(message.tool_calls) &&
    message.tool_calls.length > 0;

  const isToolResult = message?.type === "tool";

  if (isToolResult) {
    return (
      <div className="group mr-auto flex w-full items-start gap-2">
        <div className="flex w-full flex-col gap-2">
          <ToolResult message={message as Record<string, unknown>} />
        </div>
      </div>
    );
  }

  return (
    <div className="group mr-auto flex w-full items-start gap-2">
      <div className="flex w-full flex-col gap-2">
        {contentString.length > 0 && (
          <div className="py-1">
            <MarkdownText>{contentString}</MarkdownText>
          </div>
        )}

        {hasToolCalls && (
          <ToolCalls
            toolCalls={
              (
                message as unknown as {
                  tool_calls: Array<Record<string, unknown>>;
                }
              ).tool_calls
            }
          />
        )}

        {message && !isToolResult && (
          <div
            className={cn(
              "mr-auto flex items-center gap-2 transition-opacity",
              "opacity-0 group-hover:opacity-100"
            )}
          >
            <CommandBar
              content={contentString}
              isLoading={isLoading}
              isAiMessage={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function AssistantMessageLoading() {
  return (
    <div className="mr-auto flex items-start gap-2">
      <div className="bg-muted flex h-8 items-center gap-1 rounded-2xl px-4 py-2">
        <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full" />
        <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_0.5s_infinite] rounded-full" />
        <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_1s_infinite] rounded-full" />
      </div>
    </div>
  );
}
