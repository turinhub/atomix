"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 动态导入 DocViewer 组件，禁用 SSR
const DocViewer = dynamic(() => import("react-doc-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[600px] w-full">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="ml-2">加载中...</span>
    </div>
  ),
});

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
  const [title, setTitle] = useState<string>("Word 文档演示");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [renderers, setRenderers] = useState<any[]>([]);

  // 初始化时加载默认文档和渲染器
  useEffect(() => {
    const abortController = new AbortController();

    // 只在客户端执行
    if (typeof window !== "undefined") {
      loadDefaultDoc(abortController);
      // 动态加载渲染器
      import("react-doc-viewer")
        .then(mod => {
          if (!abortController.signal.aborted && mod.DocViewerRenderers) {
            setRenderers(mod.DocViewerRenderers);
          }
        })
        .catch(error => {
          if (!abortController.signal.aborted) {
            console.error("Failed to load DocViewerRenderers:", error);
            setHasError(true);
            setErrorMessage("文档渲染器加载失败");
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, []);

  // 处理 DocViewer 错误
  const handleDocViewerError = (error: any) => {
    console.error("DocViewer error:", error);
    setHasError(true);
    setErrorMessage("Word 文档加载失败，请尝试下载查看");
  };

  // 处理 URL 提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docxUrl.trim()) {
      setHasError(false);
      setErrorMessage("");
      setCurrentDocx(getProxyUrl(docxUrl));
      setTitle("自定义 Word 文档");
      toast.success("已加载 Word 文档 URL");
    } else {
      toast.error("请输入有效的 Word 文档 URL");
    }
  };

  // 加载默认文档
  const loadDefaultDoc = (abortController?: AbortController) => {
    setIsLoading(true);
    
    // 直接加载默认DOCX，不进行可访问性检查以避免CORS问题
    setCurrentDocx(getProxyUrl(DEFAULT_DOCX_URL));
    setTitle("DOCX 文档");
    setDocxUrl(DEFAULT_DOCX_URL);
    setHasError(false);
    setErrorMessage("");
    toast.success("已加载默认 DOCX 文档");
    setIsLoading(false);
  };

  // 准备文档数据
  const docs = currentDocx
    ? [
        {
          uri: currentDocx,
          fileName: currentDocx.split("/").pop() || "document.docx",
        },
      ]
    : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            使用 react-doc-viewer 在线预览 Word 文档
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleUrlSubmit} className="flex space-x-2">
            <Input
              type="url"
              placeholder="输入 Word 文档链接..."
              value={docxUrl}
              onChange={e => setDocxUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "加载中..." : "加载"}
            </Button>
          </form>

          <Button
            onClick={() => loadDefaultDoc()}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "加载中..." : "加载示例 DOCX 文档"}
          </Button>
        </CardContent>
      </Card>

      {currentDocx && (
        <Card>
          <CardHeader>
            <CardTitle>文档预览</CardTitle>
          </CardHeader>
          <CardContent>
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
              ) : DocViewer ? (
                <DocViewer
                  documents={docs}
                  pluginRenderers={renderers}
                  config={{
                    header: {
                      disableHeader: false,
                      disableFileName: false,
                      retainURLParams: false,
                    },
                  }}
                  style={{ height: "100%" }}
                />
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  文档查看器加载中...
                  <br />
                  如果长时间未加载，请刷新页面
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>功能特点</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">支持格式</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Microsoft Word (.docx)</li>
                <li>在线 URL 链接</li>
                <li>实时预览</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">预览功能</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>在线直接预览</li>
                <li>支持文档导航</li>
                <li>响应式布局</li>
                <li>支持缩放和搜索</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
