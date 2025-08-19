"use client";

import { useState } from "react";
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
import { Download, FileText, ExternalLink } from "lucide-react";

// 默认 DOCX 文件 URL
const DEFAULT_DOCX_URL = "https://oss.turinhub.com/atomix/135.docx";

export default function DocxReaderPage() {
  const [docxFile, setDocxFile] = useState<File | string | null>(
    DEFAULT_DOCX_URL
  );
  const [docxUrl, setDocxUrl] = useState<string>(DEFAULT_DOCX_URL);

  // 处理文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx")
      ) {
        const fileUrl = URL.createObjectURL(file);
        setDocxFile(file);
        setDocxUrl(fileUrl);
        toast.success("DOCX 文件已上传");
      } else {
        toast.error("请选择有效的 DOCX 文件");
      }
    }
  };

  // 处理 URL 输入
  const handleUrlSubmit = () => {
    if (docxUrl.trim()) {
      setDocxFile(docxUrl.trim());
      toast.success("DOCX 链接已设置");
    } else {
      toast.error("请输入有效的 DOCX 链接");
    }
  };

  // 加载默认文档
  const loadDefaultDoc = () => {
    setDocxFile(DEFAULT_DOCX_URL);
    setDocxUrl(DEFAULT_DOCX_URL);
    toast.success("已加载默认 DOCX 文件");
  };

  // 下载文件
  const downloadFile = () => {
    if (typeof docxFile === "string") {
      const link = document.createElement("a");
      link.href = docxFile;
      link.download = docxFile.split("/").pop() || "document.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("开始下载文件");
    } else if (docxFile instanceof File) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(docxFile);
      link.download = docxFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("开始下载文件");
    }
  };

  // 在新窗口打开
  const openInNewWindow = () => {
    if (typeof docxFile === "string") {
      window.open(docxFile, "_blank");
    } else if (docxFile instanceof File) {
      const url = URL.createObjectURL(docxFile);
      window.open(url, "_blank");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">DOCX 文档阅读器</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>DOCX 文档阅读工具</CardTitle>
          <CardDescription>
            支持上传本地 DOCX 文件或输入 DOCX 链接进行在线阅读
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">上传 DOCX 文件</TabsTrigger>
              <TabsTrigger value="url">输入 DOCX 链接</TabsTrigger>
              <TabsTrigger value="default">使用示例文件</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  选择本地 DOCX
                  文件进行阅读，文件不会上传到服务器，仅在浏览器中处理。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="输入 DOCX 文件的 URL 地址"
                    value={docxUrl}
                    onChange={e => setDocxUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleUrlSubmit}>加载</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  输入 DOCX 文件的 URL 地址进行在线阅读，URL 必须是直接指向 DOCX
                  文件的链接。
                </p>
              </div>
            </TabsContent>
            <TabsContent value="default">
              <div className="space-y-4">
                <Button onClick={loadDefaultDoc} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  加载示例文档：135.docx
                </Button>
                <p className="text-sm text-muted-foreground">
                  点击按钮加载预设的示例 DOCX 文档进行体验。
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* 文档操作区域 */}
          {docxFile && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={downloadFile} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  下载文件
                </Button>
                <Button onClick={openInNewWindow} variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  在新窗口打开
                </Button>
              </div>

              {/* 文档预览区域 */}
              <div className="border rounded-md bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">
                    {typeof docxFile === "string"
                      ? docxFile.split("/").pop()
                      : docxFile.name}
                  </span>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">DOCX 文档已加载</p>
                  <p className="text-sm mb-4">
                    由于浏览器限制，DOCX 文件无法直接在网页中预览。
                    <br />
                    请点击上方按钮下载文件或在新窗口中打开。
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={downloadFile} size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      下载查看
                    </Button>
                    <Button
                      onClick={openInNewWindow}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      新窗口打开
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                <li>支持上传本地 DOCX 文件或输入 DOCX 链接</li>
                <li>提供文件下载和新窗口打开功能</li>
                <li>文件处理完全在浏览器中进行，保护隐私</li>
                <li>支持拖放上传 DOCX 文件</li>
                <li>内置示例文档供体验使用</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">操作提示</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>上传文件后可以选择下载到本地或在新窗口中打开</li>
                <li>支持通过 URL 链接加载远程 DOCX 文件</li>
                <li>点击"使用示例文件"可以快速体验功能</li>
                <li>所有操作都在客户端完成，确保文档安全</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">注意事项</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>由于浏览器安全限制，DOCX 文件无法直接在网页中预览</li>
                <li>建议使用 Microsoft Word 或其他兼容软件打开 DOCX 文件</li>
                <li>大型 DOCX 文件可能需要较长时间加载</li>
                <li>跨域限制可能导致某些远程 DOCX 链接无法加载</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
