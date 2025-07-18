import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toolCategories } from "@/lib/routes";

export default function AIPage() {
  // 获取 AI 对话类别
  const aiCategory = toolCategories.find(
    category => category.title === "AI 对话"
  );

  if (!aiCategory) {
    return <div>未找到 AI 对话工具</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {aiCategory.tools.map(tool => (
        <Card key={tool.name} className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Link
              href={tool.path}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              使用工具
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
