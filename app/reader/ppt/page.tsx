"use client";

import { useState, useEffect, useRef } from "react";
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

// 默认 PPT 文件 URL
const DEFAULT_PPT_URL = "https://oss.turinhub.com/atomix/srm.pptx";

// 获取代理 URL
const getProxyUrl = (url: string) => {
  return `/api/proxy/document?url=${encodeURIComponent(url)}`;
};

export default function PptReaderPage() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [currentPpt, setCurrentPpt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("PPT 演示文档");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化时加载默认文档，确保容器准备就绪
  useEffect(() => {
    const checkAndLoad = () => {
      if (containerRef.current) {
        loadDefaultDoc();
        return true;
      }
      return false;
    };

    // 立即尝试
    if (!checkAndLoad()) {
      // 如果失败，使用更长的延迟重试
      const timer = setTimeout(() => {
        if (!checkAndLoad()) {
          // 再次重试
          const retryTimer = setTimeout(() => {
            checkAndLoad();
          }, 1000);
          return () => clearTimeout(retryTimer);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // 动态加载 pptx-preview.js
  useEffect(() => {
    const loadPptxPreview = async () => {
      try {
        // 动态导入 pptx-preview
        const pptxPreview = await import("pptx-preview");
        return pptxPreview;
      } catch (error) {
        console.error("加载 pptx-preview 失败:", error);
        throw error;
      }
    };

    // 预加载库
    loadPptxPreview().catch(console.error);
  }, []);

  // 使用 pptx-preview 处理 PPT 文件
  const processPptxFile = async (arrayBuffer: ArrayBuffer) => {
    try {
      // 动态导入 pptx-preview
      const pptxPreviewModule = await import("pptx-preview");
      const { init } = pptxPreviewModule;

      // 等待容器准备就绪
      let retryCount = 0;
      const maxRetries = 10;
      while (!containerRef.current && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retryCount++;
      }

      if (!containerRef.current) {
        throw new Error("容器未准备就绪，请刷新页面重试");
      }

      // 清空容器
      containerRef.current.innerHTML = "";

      // 使用 pptx-preview 初始化预览器
      const previewer = init(containerRef.current, {
        mode: "slide",
        width: containerRef.current.clientWidth || 800,
        height: 600,
      });

      // 加载 PPTX 文件
      await previewer.preview(arrayBuffer);

      // 获取幻灯片数量
      const slideCount = previewer.slideCount || 1;
      setSlides(Array.from({ length: slideCount }, (_, i) => `slide-${i}`));
      setCurrentSlide(0);

      setHasError(false);
      setErrorMessage("");
    } catch (error) {
      console.error("pptx-preview 处理失败:", error);
      setHasError(true);
      setErrorMessage("PPT 文件处理失败，请检查文件格式或尝试其他文件");
      throw error;
    }
  };

  // 处理 URL 提交
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      toast.error("请输入有效的 PPT 链接");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const proxyUrl = getProxyUrl(inputUrl);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // 先设置 currentPpt 以确保容器渲染
      setCurrentPpt(proxyUrl);
      setTitle(inputUrl.split("/").pop() || "PPT 演示文档");

      // 等待下一个渲染周期，确保容器已渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      await processPptxFile(arrayBuffer);
      toast.success("PPT 加载成功");
    } catch (error) {
      console.error("加载 PPT 失败:", error);
      setHasError(true);
      setErrorMessage("PPT 加载失败，请检查链接是否正确");
      toast.error("PPT 加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pptx")) {
      toast.error("请选择 .pptx 格式的文件");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const arrayBuffer = await file.arrayBuffer();

      // 先设置 currentPpt 以确保容器渲染
      setCurrentPpt(URL.createObjectURL(file));
      setTitle(file.name);

      // 等待下一个渲染周期，确保容器已渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      await processPptxFile(arrayBuffer);
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

  // 幻灯片导航
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
      // 这里可以添加实际的幻灯片切换逻辑
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  // 加载默认文档
  const loadDefaultDoc = async () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    try {
      const proxyUrl = getProxyUrl(DEFAULT_PPT_URL);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // 先设置 currentPpt 以确保容器渲染
      setCurrentPpt(proxyUrl);
      setTitle("示例 PPT 文档");
      setInputUrl(DEFAULT_PPT_URL);

      // 等待下一个渲染周期，确保容器已渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      await processPptxFile(arrayBuffer);
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">PPT 演示文档阅读器</h1>
        <p className="text-muted-foreground">
          上传本地 PPTX 文件或输入文档链接进行在线预览
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            使用 pptx-preview.js 在线预览 PPT 演示文档
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => loadDefaultDoc()} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                "加载示例 PPT 文档"
              )}
            </Button>
          </div>

          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="输入 PPT 文档链接 (如: https://example.com/demo.pptx)"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                加载
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 文件上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle>文件上传</CardTitle>
          <CardDescription>选择本地 PPTX 文件进行预览</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <input
                type="file"
                accept=".pptx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                选择 PPTX 文件
              </label>
              <p className="mt-2 text-sm text-gray-500">
                支持 .pptx 格式的 PowerPoint 文件
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 文档预览区域 */}
      <Card>
        <CardHeader>
          <CardTitle>文档预览</CardTitle>
          <CardDescription>
            {isLoading ? "正在加载文档..." : title || "PPT 演示文档"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 加载状态 */}
            {isLoading && (
              <div className="flex justify-center items-center h-[600px] w-full">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">加载中...</span>
              </div>
            )}

            {/* 错误提示 */}
            {hasError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p>
                      {errorMessage ||
                        "PPT 文件预览失败。请检查文件链接是否正确，或尝试使用其他 PPT 文档。"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      某些 PPT 文件格式可能不支持在线预览，建议使用标准的 .pptx
                      格式。
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* PPT 预览容器 - 始终渲染 */}
            <div
              ref={containerRef}
              className="w-full min-h-[600px] border rounded-lg overflow-hidden bg-gray-50"
              style={{ minHeight: "600px" }}
            >
              {!currentPpt && !isLoading && !hasError && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="mb-2">正在加载示例文档...</p>
                    <p className="text-sm">支持在线预览 PowerPoint 演示文稿</p>
                  </div>
                </div>
              )}
              {hasError && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="mb-2">文档加载失败</p>
                    <p className="text-sm">请尝试重新加载或选择其他文件</p>
                  </div>
                </div>
              )}
            </div>

            {/* 幻灯片导航 */}
            {slides.length > 0 && (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  variant="outline"
                  size="sm"
                >
                  上一页
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentSlide + 1} / {slides.length}
                </span>
                <Button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  variant="outline"
                  size="sm"
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
