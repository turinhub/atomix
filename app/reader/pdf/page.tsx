"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// 默认 PDF 文件 URL
const DEFAULT_PDF_URL = "https://oss.turinhub.com/atomix/DeepSeek_R1.pdf";

// 动态导入 PDF 查看器组件，禁用 SSR
const PDFViewer = dynamic(
  () => import("@/components/reader/PDFViewer").then((mod) => mod.PDFViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[500px] w-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载 PDF 查看器...</span>
      </div>
    )
  }
);

// 动态导入简单 PDF 查看器组件，禁用 SSR
const SimplePDFViewer = dynamic(
  () => import("@/components/reader/SimplePDFViewer").then((mod) => mod.SimplePDFViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[500px] w-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载简单 PDF 查看器...</span>
      </div>
    )
  }
);

export default function PDFReaderPage() {
  const [pdfFile, setPdfFile] = useState<File | string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useSimpleViewer, setUseSimpleViewer] = useState<boolean>(false);

  // 初始化时加载默认 PDF
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      loadDefaultPdf();
    }
  }, []);

  // 处理 URL 提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfUrl.trim()) {
      setPdfFile(pdfUrl);
      toast.success("已加载 PDF URL");
    } else {
      toast.error("请输入有效的 PDF URL");
    }
  };

  // 处理文件上传
  const handleFileChange = (file: File | null) => {
    if (file) {
      setPdfFile(file);
    }
  };

  // 加载默认 PDF
  const loadDefaultPdf = () => {
    setIsLoading(true);
    
    // 检查默认 PDF 是否可访问（仅在客户端环境）
    if (typeof window !== 'undefined') {
      fetch(DEFAULT_PDF_URL, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            setPdfFile(DEFAULT_PDF_URL);
            setPdfUrl(DEFAULT_PDF_URL);
            toast.success("已加载默认 PDF 文件");
          } else {
            setPdfFile(null);
            toast.error("默认 PDF 文件无法访问");
          }
        })
        .catch(() => {
          setPdfFile(null);
          toast.error("默认 PDF 文件加载失败");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 服务器端渲染时不加载 PDF
      setIsLoading(false);
    }
  };

  // 切换查看器
  const toggleViewer = () => {
    setUseSimpleViewer(!useSimpleViewer);
    toast.success(`已切换到${!useSimpleViewer ? '简单' : '高级'}查看器`);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">PDF 阅读器</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PDF 文档阅读工具</CardTitle>
          <CardDescription>
            支持上传本地 PDF 文件或输入 PDF 链接进行在线阅读
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">上传 PDF 文件</TabsTrigger>
              <TabsTrigger value="url">输入 PDF 链接</TabsTrigger>
              <TabsTrigger value="default">使用示例文件</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-4">
                  选择本地 PDF 文件进行阅读，文件不会上传到服务器，仅在浏览器中处理。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-4">
                  输入 PDF 文件的 URL 地址进行在线阅读，URL 必须是直接指向 PDF 文件的链接。
                </p>
                <form onSubmit={handleUrlSubmit} className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">加载</Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="default">
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground mb-4">
                  使用示例 PDF 文件进行演示，点击下方按钮加载默认文件。
                </p>
                <Button onClick={loadDefaultPdf} className="mr-2">加载示例文件</Button>
                <Button variant="outline" onClick={toggleViewer}>
                  {useSimpleViewer ? '使用高级查看器' : '使用简单查看器'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border rounded-lg p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">加载中...</span>
              </div>
            ) : useSimpleViewer ? (
              <SimplePDFViewer file={pdfFile} onFileChange={handleFileChange} />
            ) : (
              <PDFViewer file={pdfFile} onFileChange={handleFileChange} />
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">功能特点</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>支持上传本地 PDF 文件或输入 PDF 链接</li>
                <li>提供页面导航、缩放和旋转功能</li>
                <li>文件处理完全在浏览器中进行，保护隐私</li>
                <li>支持键盘快捷键操作</li>
                <li>提供简单查看器和高级查看器两种模式</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">操作提示</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>使用页面导航按钮或输入页码跳转到指定页面</li>
                <li>使用缩放按钮或滑块调整文档大小</li>
                <li>点击旋转按钮可以旋转文档视图</li>
                <li>支持拖放上传 PDF 文件</li>
                <li>如果高级查看器无法正常工作，可以切换到简单查看器</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">注意事项</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>大型 PDF 文件可能需要较长时间加载</li>
                <li>某些受保护的 PDF 文件可能无法正常显示</li>
                <li>跨域限制可能导致某些远程 PDF 链接无法加载</li>
                <li>如果遇到加载问题，请尝试切换到简单查看器模式</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 