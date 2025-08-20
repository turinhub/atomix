"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import PDFViewer from "@/components/read/PDFViewer";

// 默认 PDF 文件 URL - 保持使用现有的 demo.pdf
const DEFAULT_PDF_URL = "https://oss.turinhub.com/atomix/DeepSeek_R1.pdf";

// 获取代理 URL
const getProxyUrl = (url: string) => {
  return `/api/proxy/document?url=${encodeURIComponent(url)}`;
};

export default function PDFReaderPage() {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPdfUri, setCurrentPdfUri] = useState<string>(DEFAULT_PDF_URL);
  const [title, setTitle] = useState<string>("DeepSeek R1 技术报告");

  // 初始化时加载默认 PDF
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== "undefined") {
      loadDefaultPdf();
    }
  }, []);

  // 处理 URL 提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfUrl.trim()) {
      setCurrentPdfUri(getProxyUrl(pdfUrl));
      setTitle("自定义 PDF 文档");
      toast.success("已加载 PDF URL");
    } else {
      toast.error("请输入有效的 PDF URL");
    }
  };

  // 加载默认 PDF
  const loadDefaultPdf = () => {
    setIsLoading(true);
    
    // 直接加载默认PDF，不进行可访问性检查以避免CORS问题
    setCurrentPdfUri(getProxyUrl(DEFAULT_PDF_URL));
    setTitle("DeepSeek R1 技术报告");
    setPdfUrl(DEFAULT_PDF_URL);
    toast.success("已加载默认 PDF 文件");
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">PDF 阅读器</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PDF 文档阅读工具</CardTitle>
          <CardDescription>
            使用先进的 PDF 查看器，支持缩放、旋转、书签导航等功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="default" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default">使用示例文件</TabsTrigger>
              <TabsTrigger value="url">输入 PDF 链接</TabsTrigger>
            </TabsList>
            <TabsContent value="default">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-4">
                  使用示例 PDF 文件进行演示，点击下方按钮加载 DeepSeek_R1.pdf
                  文件。
                </p>
                <Button onClick={loadDefaultPdf}>加载 demo.pdf</Button>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-4">
                  输入 PDF 文件的 URL 地址进行在线阅读，URL 必须是直接指向 PDF
                  文件的链接。
                </p>
                <form onSubmit={handleUrlSubmit} className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={pdfUrl}
                    onChange={e => setPdfUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">加载</Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="border rounded-lg p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">加载中...</span>
              </div>
            ) : currentPdfUri ? (
              <div className="h-[calc(100vh-200px)] min-h-[500px]">
                <PDFViewer pdfUri={currentPdfUri} title={title} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                <div className="text-center">
                  <p className="mb-4">请选择一个 PDF 文件进行阅读</p>
                  <Button onClick={loadDefaultPdf}>加载示例文件</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>功能特点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">阅读功能</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>支持页面导航和快速跳转</li>
                <li>缩放功能（50%-250%）</li>
                <li>文档旋转功能</li>
                <li>单页/滚动模式切换</li>
                <li>全屏阅读模式</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">辅助功能</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>缩略图预览</li>
                <li>书签导航</li>
                <li>键盘快捷键支持</li>
                <li>移动端适配</li>
                <li>侧边栏显示/隐藏</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">快捷键</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <kbd>←</kbd> / <kbd>→</kbd> - 上一页/下一页
              </li>
              <li>
                <kbd>Ctrl</kbd> + <kbd>=</kbd> / <kbd>Ctrl</kbd> + <kbd>-</kbd>{" "}
                - 放大/缩小
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
