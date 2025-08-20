"use client";

import { useState, useEffect } from "react";
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
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import mammoth from "mammoth";

// 默认 DOCX 文件 URL
const DEFAULT_DOCX_URL = "https://oss.turinhub.com/atomix/135.docx";

// 获取代理 URL
const getProxyUrl = (url: string) => {
  return `/api/proxy/document?url=${encodeURIComponent(url)}`;
};

export default function DocxReaderPage() {
  const [docxUrl, setDocxUrl] = useState<string>("");
  const [currentDocx, setCurrentDocx] = useState<string>(DEFAULT_DOCX_URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("Word 文档阅读器");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");

  // 初始化时加载默认文档
  useEffect(() => {
    loadDefaultDoc();
  }, []);

  // 使用 Mammoth.js 转换 Word 文档
  const convertDocxToHtml = async (arrayBuffer: ArrayBuffer) => {
    try {
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
      setHasError(false);
      setErrorMessage("");

      if (result.messages.length > 0) {
        console.warn("Mammoth 转换警告:", result.messages);
      }
    } catch (error) {
      console.error("Mammoth 转换失败:", error);
      setHasError(true);
      setErrorMessage("文档转换失败，请检查文档格式");
      throw error;
    }
  };

  // 处理 URL 提交
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docxUrl.trim()) {
      toast.error("请输入有效的文档链接");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const proxyUrl = getProxyUrl(docxUrl);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      await convertDocxToHtml(arrayBuffer);

      setCurrentDocx(proxyUrl);
      setTitle(docxUrl.split("/").pop() || "Word 文档");
      toast.success("文档加载成功");
    } catch (error) {
      console.error("加载文档失败:", error);
      setHasError(true);
      setErrorMessage("文档加载失败，请检查链接是否正确");
      toast.error("文档加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 加载默认文档
  const loadDefaultDoc = async () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const proxyUrl = getProxyUrl(DEFAULT_DOCX_URL);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      await convertDocxToHtml(arrayBuffer);

      setCurrentDocx(proxyUrl);
      setTitle("示例 Word 文档");
      setDocxUrl(DEFAULT_DOCX_URL);
      toast.success("默认文档加载成功");
    } catch (error) {
      console.error("加载默认文档失败:", error);
      setHasError(true);
      setErrorMessage("默认文档加载失败，请检查网络连接");
      toast.error("默认文档加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".docx")) {
      toast.error("请选择 .docx 格式的文件");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      await convertDocxToHtml(arrayBuffer);

      setCurrentDocx(URL.createObjectURL(file));
      setTitle(file.name);
      toast.success("文件上传成功");
    } catch (error) {
      console.error("文件处理失败:", error);
      setHasError(true);
      setErrorMessage("文件处理失败，请检查文件格式");
      toast.error("文件处理失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">DOCX 阅读器</h1>
        <p className="text-muted-foreground">
          上传本地 DOCX 文件或输入 DOCX 链接进行预览
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            使用 Mammoth.js 在线预览 Word 文档，支持更好的格式保持
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadDefaultDoc} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                "加载示例 DOCX 文档"
              )}
            </Button>
          </div>

          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="输入 DOCX URL (如: https://example.com/demo.docx)"
                value={docxUrl}
                onChange={e => setDocxUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">加载</Button>
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-[600px] w-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : currentDocx ? (
        <div className="w-full h-[600px] border rounded-lg overflow-hidden">
          {hasError ? (
            <Alert className="h-full flex flex-col justify-center">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                {errorMessage}
              </AlertDescription>
              <div className="mt-4 text-sm text-muted-foreground">
                请尝试使用其他 Word 文档链接，或检查文档格式是否正确。
              </div>
            </Alert>
          ) : htmlContent ? (
            <div
              className="h-full p-6 overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                fontFamily: "Times New Roman, serif",
                lineHeight: "1.6",
                fontSize: "14px",
              }}
            />
          ) : (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">请上传 Word 文档或加载示例文档</p>
                <p className="text-sm">
                  支持 .docx 格式，使用 Mammoth.js 进行高质量转换
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[600px] w-full border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-muted-foreground">请加载 DOCX 文件</p>
        </div>
      )}
    </div>
  );
}
