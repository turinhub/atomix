"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SimplePDFViewerProps {
  file: string | File | null;
  onFileChange?: (file: File | null) => void;
}

export function SimplePDFViewer({ file, onFileChange }: SimplePDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(
    typeof file === "string" ? file : null
  );

  // 处理文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const fileUrl = URL.createObjectURL(files[0]);
      setPdfUrl(fileUrl);

      if (onFileChange) {
        onFileChange(files[0]);
      }

      toast.success("PDF 文件已加载");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 控制栏 */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded-md">
        {/* 文件上传 */}
        <div className="flex-1 min-w-[200px]">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {pdfUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(pdfUrl, "_blank")}
          >
            在新窗口打开
          </Button>
        )}
      </div>

      {/* PDF 查看区域 */}
      <div className="flex-1 overflow-hidden border rounded-md bg-white dark:bg-gray-900 min-h-[500px]">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[500px]"
            title="PDF Viewer"
          />
        ) : file instanceof File ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="mb-4">PDF 文件已上传，但无法在内联框架中显示</p>
            <Button
              variant="outline"
              onClick={() => {
                const url = URL.createObjectURL(file);
                window.open(url, "_blank");
              }}
            >
              在新窗口打开
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="mb-4">请上传 PDF 文件或提供 PDF 链接</p>
          </div>
        )}
      </div>
    </div>
  );
}
