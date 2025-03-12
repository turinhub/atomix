"use client";

import { Bot, User, Clock } from "lucide-react";
import { ChatMessage } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ThinkContent } from "./think-content";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";
  
  // 格式化时间
  const formattedTime = format(new Date(message.createdAt), "HH:mm", { locale: zhCN });

  if (isSystem) {
    return (
      <div className="px-3 py-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-md my-2">
        <p className="italic">{message.content}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 sm:gap-3 my-4 sm:my-6 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {isAssistant && (
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mt-1">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex flex-col max-w-[85%] sm:max-w-[80%]">
        <div className={cn(
          "text-[10px] sm:text-xs text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "text-right" : "text-left"
        )}>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {formattedTime}
          </span>
        </div>
        
        <Card
          className={cn(
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <CardContent className={cn(
            "p-2 sm:p-3",
            isAssistant ? "prose prose-sm dark:prose-invert max-w-none" : ""
          )}>
            {isAssistant ? (
              <ThinkContent content={message.content} />
            ) : (
              <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {isUser && (
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mt-1">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 