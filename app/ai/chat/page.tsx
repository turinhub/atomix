import { Metadata } from "next";
import { ChatInterface } from "@/components/ai/chat-interface";

export const metadata: Metadata = {
  title: "Deepseek Qwen 32B 对话 - Turinhub Atomix",
  description: "基于 Cloudflare AI 的 Deepseek Qwen 32B 对话工具",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      <ChatInterface />
    </div>
  );
} 