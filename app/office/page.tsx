import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table } from "lucide-react";
import { toolCategories } from "@/lib/routes";

export default function OfficePage() {
  // 找到办公工具分类
  const officeCategory = toolCategories.find(
    category => category.url === "/office"
  );

  if (!officeCategory) {
    return <div>分类未找到</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Table className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{officeCategory.title}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {officeCategory.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {officeCategory.tools.map(tool => (
            <Link key={tool.path} href={tool.url}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">关于办公工具</h2>
          <p className="text-muted-foreground leading-relaxed">
            我们提供了一系列强大的在线办公工具，旨在提高您的工作效率。这些工具完全基于Web技术，
            无需安装任何软件，即可享受专业级的办公体验。所有工具都经过精心设计，
            具有直观的用户界面和强大的功能。
          </p>
        </div>
      </div>
    </div>
  );
}
