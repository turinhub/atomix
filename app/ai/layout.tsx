import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 对话 - Turinhub Atomix",
  description: "人工智能对话和交互工具",
};

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI 对话</h1>
        <p className="text-muted-foreground">
          OpenAI API Compatible 对话页面
        </p>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
} 