import { DifyChatInterface } from "@/components/ai/dify-chat-interface";

export const metadata = {
  title: "DeepSeek R1 对话 | Atomix",
  description: "基于 Dify API 的 DeepSeek R1 对话工具",
};

export default function DifyChatPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dify API 对话</h1>
        <p className="text-muted-foreground">
          基于 Dify API 的对话工具，使用 DeepSeek R1
        </p>
      </div>
      <DifyChatInterface />
    </div>
  );
}
