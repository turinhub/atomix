import MarkdownEditor from "@/components/office/markdown-editor";
import MarkdownHelp from "@/components/office/markdown-help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown 在线编辑器 - Turinhub Atomix",
  description: "支持实时预览的 Markdown 编辑器，适用于技术文档和笔记编写",
};

export default function MarkdownPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Markdown 在线编辑器</h1>
          <p className="text-muted-foreground">
            支持实时预览的专业 Markdown
            编辑器，适用于技术文档、笔记、博客等内容创作
          </p>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">编辑器</TabsTrigger>
            <TabsTrigger value="help">语法帮助</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-4">
            <div className="border rounded-lg overflow-hidden bg-card">
              <MarkdownEditor className="w-full" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">🚀 主要特性</h3>
                <ul className="text-sm space-y-1">
                  <li>• 实时预览，所见即所得</li>
                  <li>• 完整的 Markdown 语法支持</li>
                  <li>• 代码语法高亮</li>
                  <li>• 工具栏快速插入</li>
                  <li>• 本地自动保存</li>
                  <li>• 响应式设计</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">⌨️ 快捷键</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    •{" "}
                    <code className="bg-background px-1 rounded">Ctrl + S</code>{" "}
                    保存文档
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-background px-1 rounded">Ctrl + B</code>{" "}
                    粗体
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-background px-1 rounded">Ctrl + I</code>{" "}
                    斜体
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-background px-1 rounded">Ctrl + K</code>{" "}
                    插入链接
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-background px-1 rounded">Ctrl + Z</code>{" "}
                    撤销
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-background px-1 rounded">Ctrl + Y</code>{" "}
                    重做
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="mt-4">
            <MarkdownHelp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
