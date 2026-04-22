"use client";

import { Thread } from "@/components/langgraph/thread";
import { StreamProvider } from "@/components/langgraph/providers/stream-provider";
import React from "react";

export default function LangGraphChatPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      }
    >
      <StreamProvider>
        <Thread />
      </StreamProvider>
    </React.Suspense>
  );
}
