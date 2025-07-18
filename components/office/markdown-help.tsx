import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MarkdownHelp() {
  const syntaxExamples = [
    {
      category: "标题",
      items: [
        { syntax: "# 一级标题", description: "最大的标题" },
        { syntax: "## 二级标题", description: "次级标题" },
        { syntax: "### 三级标题", description: "三级标题" },
      ],
    },
    {
      category: "文本样式",
      items: [
        { syntax: "**粗体文本**", description: "加粗显示" },
        { syntax: "*斜体文本*", description: "倾斜显示" },
        { syntax: "~~删除线~~", description: "删除线效果" },
        { syntax: "`行内代码`", description: "行内代码样式" },
      ],
    },
    {
      category: "列表",
      items: [
        { syntax: "- 无序列表项", description: "无序列表" },
        { syntax: "1. 有序列表项", description: "有序列表" },
        { syntax: "  - 嵌套列表项", description: "嵌套列表" },
      ],
    },
    {
      category: "链接和图片",
      items: [
        { syntax: "[链接文本](URL)", description: "创建链接" },
        { syntax: "![图片描述](图片URL)", description: "插入图片" },
        { syntax: "<https://example.com>", description: "自动链接" },
      ],
    },
    {
      category: "代码块",
      items: [
        {
          syntax: "```javascript\ncode\n```",
          description: "带语言高亮的代码块",
        },
        { syntax: "```\n普通代码块\n```", description: "普通代码块" },
      ],
    },
    {
      category: "表格",
      items: [
        {
          syntax: "| 列1 | 列2 |\n|-----|-----|\n| 内容 | 内容 |",
          description: "创建表格",
        },
      ],
    },
    {
      category: "其他",
      items: [
        { syntax: "> 引用文本", description: "引用块" },
        { syntax: "---", description: "水平分割线" },
        { syntax: "- [ ] 待办事项", description: "待办列表" },
        { syntax: "- [x] 已完成", description: "已完成事项" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Markdown 语法参考</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {syntaxExamples.map(category => (
              <div key={category.category} className="space-y-3">
                <Badge variant="secondary">{category.category}</Badge>
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div key={index} className="border rounded p-3 space-y-2">
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {item.syntax}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使用技巧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">编辑技巧</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 使用工具栏快速插入常用元素</li>
                <li>• 支持拖拽调整编辑器高度</li>
                <li>• 可以切换编辑/预览/分屏模式</li>
                <li>• 支持全屏编辑模式</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">保存和导出</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 内容自动保存到浏览器本地</li>
                <li>• 可以复制 Markdown 原文</li>
                <li>• 可以复制渲染后的 HTML</li>
                <li>• 支持打印预览内容</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
