"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";

// 默认 PDF 文件 URL
const DEFAULT_PDF_URL = "https://oss.turinhub.com/atomix/DeepSeek_R1.pdf";

// 获取代理 URL
const getProxyUrl = (url: string) => {
  return `/api/proxy/document?url=${encodeURIComponent(url)}`;
};

export default function PDF2ReaderPage() {
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
    setCurrentPdfUri(getProxyUrl(DEFAULT_PDF_URL));
    setTitle("DeepSeek R1 技术报告");
    setPdfUrl(DEFAULT_PDF_URL);
    toast.success("已加载默认 PDF 文件");
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">PDF2 阅读器</h1>
        <p className="text-muted-foreground">
          简介版 PDF 阅读器，使用 iframe 嵌套，支持在线文档查看
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
          <CardDescription>
            使用先进的 PDF 查看器，支持多种文档格式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadDefaultPdf} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                "加载 demo.pdf"
              )}
            </Button>
          </div>

          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="输入 PDF URL (如: https://example.com/demo.pdf)"
                value={pdfUrl}
                onChange={e => setPdfUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">加载</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : currentPdfUri ? (
        <div className="h-[calc(100vh-200px)] min-h-[500px] border rounded-lg">
          <iframe
            src={currentPdfUri}
            className="w-full h-full"
            title={title}
            frameBorder="0"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-[500px] w-full border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-muted-foreground">请加载 PDF 文件</p>
        </div>
      )}
    </div>
  );
}
