"use client";

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import { Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整文本区域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"; // 重置高度
      const scrollHeight = textareaRef.current.scrollHeight;
      // 限制最大高度为 200px
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
      // 重置文本区域高度
      if (textareaRef.current) {
        textareaRef.current.style.height = "80px";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearInput = () => {
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "80px";
      textareaRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "relative rounded-lg border bg-background transition-all",
          isFocused ? "ring-2 ring-ring" : "",
          isLoading ? "opacity-80" : ""
        )}
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="输入消息，按 Enter 发送，Shift+Enter 换行..."
          className="min-h-[80px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-24"
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {input.trim() && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={clearInput}
              className="h-8 w-8"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">清除</span>
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">发送</span>
          </Button>
        </div>
      </form>
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Deepseek Qwen 32B 模型可能会产生不准确的信息，请谨慎使用
      </div>
    </div>
  );
} 