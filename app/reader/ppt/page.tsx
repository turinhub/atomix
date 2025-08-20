"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 动态导入 DocViewer 组件，禁用 SSR
const DocViewer = dynamic(() => import("react-doc-viewer"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">加载中...</div>,
});

// 默认 PPT 文件 URL
const DEFAULT_PPT_URL = "https://oss.turinhub.com/atomix/srm.pptx";

export default function PptReaderPage() {
  const [pptUrl, setPptUrl] = useState<string>("");
  const [currentPpt, setCurrentPpt] = useState<string>(DEFAULT_PPT_URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("PPT 演示文档");
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
      import("react-doc-viewer").then(mod => {
        if (!abortController.signal.aborted && mod.DocViewerRenderers) {
          setRenderers(mod.DocViewerRenderers);
        }
      }).catch(error => {
        if (!abortController.signal.aborted) {
          console.error("加载渲染器失败:", error);
          setHasError(true);
          setErrorMessage("文档渲染器加载失败");
        }
      });
    }
    
    return () => {
      abortController.abort();
    };
  }, []);

  // 处理 URL 提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pptUrl.trim()) {
      setCurrentPpt(pptUrl);
      setTitle("自定义 PPT 演示");
      // 尝试使用 react-doc-viewer 预览 PPT 文件
      setHasError(false);
      setErrorMessage("");
      toast.success("已加载 PPT 文档 URL");
    } else {
      toast.error("请输入有效的 PPT 文档 URL");
    }
  };

  // 加载默认文档
  const loadDefaultDoc = (abortController?: AbortController) => {
    setIsLoading(true);

    // 检查默认文档是否可访问（仅在客户端环境）
    if (typeof window !== "undefined") {
      fetch(DEFAULT_PPT_URL, { 
        method: "HEAD",
        signal: abortController?.signal
      })
        .then(response => {
          if (!abortController?.signal.aborted && response.ok) {
            setCurrentPpt(DEFAULT_PPT_URL);
            setTitle("PPT 演示文档");
            setPptUrl(DEFAULT_PPT_URL);
            // 尝试使用 react-doc-viewer 预览 PPT 文件
            setHasError(false);
            setErrorMessage("");
            toast.success("已加载默认 PPT 文档");
          } else if (!abortController?.signal.aborted) {
            setCurrentPpt("");
            toast.error("默认 PPT 文档无法访问");
          }
        })
        .catch((error) => {
          if (!abortController?.signal.aborted && error.name !== 'AbortError') {
            setCurrentPpt("");
            toast.error("默认 PPT 文档加载失败");
          }
        })
        .finally(() => {
          if (!abortController?.signal.aborted) {
            setIsLoading(false);
          }
        });
    } else {
      // 服务器端渲染时不加载文档
      setIsLoading(false);
    }
  };



  // 准备文档数据
  const docs = currentPpt
    ? [
        {
          uri: currentPpt,
          fileName: title,
        },
      ]
    : [];

  // 处理 DocViewer 错误
  const handleDocViewerError = (error: any) => {
    console.error("DocViewer 错误:", error);
    toast.error("文档预览失败，PPT 文件可能需要下载查看");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            使用 react-doc-viewer 在线预览 PPT 演示文档
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleUrlSubmit} className="flex space-x-2">
            <Input
              type="url"
              placeholder="输入 PPT 文档链接..."
              value={pptUrl}
              onChange={(e) => setPptUrl(e.target.value)}
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
            {isLoading ? "加载中..." : "加载示例 PPT 文档"}
          </Button>
        </CardContent>
      </Card>

      {currentPpt && (
        <Card>
          <CardHeader>
            <CardTitle>文档预览</CardTitle>
          </CardHeader>
          <CardContent>
            {hasError ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p>PPT 文件预览失败。请检查文件链接是否正确，或尝试使用其他 PPT 文档。</p>
                    <p className="text-sm text-muted-foreground">
                      某些 PPT 文件格式可能不支持在线预览，建议使用标准的 .pptx 格式。
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                {DocViewer && (
                  <div className="h-full">
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
                  </div>
                )}
                {!DocViewer && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <p className="mb-2">文档查看器加载中...</p>
                      <p className="text-sm">如果长时间无响应，请尝试刷新页面</p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                <li>Microsoft PowerPoint (.pptx)</li>
                <li>在线 URL 链接</li>
                <li>实时预览</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">预览功能</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>在线直接预览</li>
                <li>支持幻灯片导航</li>
                <li>响应式布局</li>
                <li>支持缩放和全屏</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
