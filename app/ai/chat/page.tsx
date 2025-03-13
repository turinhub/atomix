import { Metadata } from "next";
import { ChatInterface } from "@/components/ai/chat-interface";

export const metadata: Metadata = {
  title: "Deepseek Qwen 32B 对话 - Turinhub Atomix",
  description: "基于 Cloudflare AI 的 Deepseek Qwen 32B 对话工具",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cloudflare AI API 对话</h1>
        <p className="text-muted-foreground">
          使用 Cloudflare AI API，使用 Deepseek Qwen 32B
        </p>
      </div>
      <ChatInterface />
    </div>
  );
} 