"use client";

import { type Message } from "@langchain/langgraph-sdk";
import { getContentString } from "../utils";
import { cn } from "@/lib/utils";
import { CommandBar } from "./shared";

export function HumanMessage({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) {
  const contentString = getContentString(message.content);

  return (
    <div className="group ml-auto flex items-center gap-2">
      <div className="flex flex-col gap-2">
        {contentString ? (
          <p className="bg-muted ml-auto w-fit rounded-3xl px-4 py-2 text-right whitespace-pre-wrap">
            {contentString}
          </p>
        ) : null}

        <div
          className={cn(
            "ml-auto flex items-center gap-2 transition-opacity",
            "opacity-0 group-hover:opacity-100"
          )}
        >
          <CommandBar
            isLoading={isLoading}
            content={contentString}
            isHumanMessage={true}
          />
        </div>
      </div>
    </div>
  );
}
