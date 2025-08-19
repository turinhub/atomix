"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { FileText, Download, ExternalLink, Upload, Link } from "lucide-react";

// 默认 PPT 文件 URL
const DEFAULT_PPT_URL = "https://oss.turinhub.com/atomix/srm.pptx";

export default function PptReaderPage() {
  const [pptUrl, setPptUrl] = useState<string>(DEFAULT_PPT_URL);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // 加载默认文档
  const loadDefaultDoc = () => {
    setPptUrl(DEFAULT_PPT_URL);
    toast.success("已加载默认 PPT 文档");
  };

  // 处理 URL 提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setPptUrl(customUrl.trim());
      toast.success("PPT URL 已更新");
    } else {
      toast.error("请输入有效的 PPT URL");
    }
  };

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        selectedFile.type === "application/vnd.ms-powerpoint" ||
        selectedFile.name.toLowerCase().endsWith(".ppt") ||
        selectedFile.name.toLowerCase().endsWith(".pptx")
      ) {
        setFile(selectedFile);
        const fileUrl = URL.createObjectURL(selectedFile);
        setPptUrl(fileUrl);
        toast.success(`已选择文件：${selectedFile.name}`);
      } else {
        toast.error("请选择有效的 PPT 文件（.ppt 或 .pptx）");
      }
    }
  };

  // 下载文件
  const downloadFile = () => {
    if (pptUrl) {
      const link = document.createElement("a");
      link.href = pptUrl;
      link.download = file?.name || "presentation.pptx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("开始下载 PPT 文件");
    }
  };

  // 在新窗口打开
  const openInNewWindow = () => {
    if (pptUrl) {
      window.open(pptUrl, "_blank");
      toast.success("已在新窗口打开 PPT 文件");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">PPT 演示文稿阅读器</h1>
        <p className="text-muted-foreground">
          支持上传本地 PPT 文件或通过 URL 加载远程文件。由于浏览器限制，PPT
          文件无法直接在网页中预览，但您可以下载文件或在新窗口中打开。
        </p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="example" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="example">示例文件</TabsTrigger>
            <TabsTrigger value="upload">上传文件</TabsTrigger>
            <TabsTrigger value="url">远程链接</TabsTrigger>
          </TabsList>

          <TabsContent value="example" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  示例 PPT 文档
                </CardTitle>
                <CardDescription>
                  使用预设的示例 PPT 文件进行演示
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground mb-4">
                    点击下方按钮加载示例 PPT 文档：srm.pptx
                  </p>
                  <Button onClick={loadDefaultDoc} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    加载示例文档：srm.pptx
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    这是一个来自 OSS 的示例 PPT 文件
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  上传本地文件
                </CardTitle>
                <CardDescription>选择您设备上的 PPT 文件</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">选择 PPT 文件</p>
                      <p className="text-xs text-muted-foreground">
                        支持 .ppt 和 .pptx 格式
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onChange={handleFileChange}
                      className="mt-4"
                    />
                  </div>
                  {file && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">
                        <strong>已选择文件：</strong> {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        文件大小：{(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  远程链接
                </CardTitle>
                <CardDescription>输入 PPT 文件的 URL 地址</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="请输入 PPT 文件的 URL（如：https://example.com/file.pptx）"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    加载 PPT 文件
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {pptUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>当前 PPT 文件</CardTitle>
            <CardDescription>
              由于浏览器限制，PPT 文件无法直接在网页中预览
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm mb-4">
                <strong>文件地址：</strong>
                <br />
                <span className="break-all text-muted-foreground">
                  {pptUrl}
                </span>
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={downloadFile} className="flex-1 min-w-[120px]">
                  <Download className="mr-2 h-4 w-4" />
                  下载查看
                </Button>
                <Button
                  onClick={openInNewWindow}
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  新窗口打开
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>使用说明：</strong>
          由于浏览器安全限制，PPT 文件无法直接在网页中预览。您可以：
          <br />• 点击"下载查看"按钮下载文件到本地，然后使用 PowerPoint
          或其他支持的应用程序打开
          <br />• 点击"新窗口打开"按钮在新标签页中打开文件（可能会触发下载）
          <br />• 支持的格式：.ppt、.pptx
        </AlertDescription>
      </Alert>
    </div>
  );
}
