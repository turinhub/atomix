"use client";

import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { toast } from "sonner";
import "@/lib/pdf-worker";

// 导入 PDF.js 样式
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
  file: string | File | null;
  onFileChange?: (file: File | null) => void;
}

export function PDFViewer({ file, onFileChange }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 重置状态当文件改变时
  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);
    setIsLoading(true);
  }, [file]);

  // 文档加载成功回调
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    toast.success(`PDF 文档加载成功，共 ${numPages} 页`);
  };

  // 文档加载失败回调
  const onDocumentLoadError = (error: Error) => {
    setIsLoading(false);
    toast.error(`PDF 文档加载失败: ${error.message}`);
    console.error("PDF 加载错误:", error);
  };

  // 处理文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      if (onFileChange) {
        onFileChange(files[0]);
      }
    }
  };

  // 页面导航
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setPageNumber(prev => Math.min(prev + 1, numPages));
    }
  };

  // 缩放控制
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  // 旋转控制
  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
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

        {/* 页面导航 */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || !file}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 px-2">
            <span className="text-sm">
              {pageNumber} / {numPages || "?"}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= numPages || !file}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 缩放控制 */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            disabled={!file}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="w-24 px-2">
            <Slider
              value={[scale * 100]}
              min={50}
              max={300}
              step={10}
              onValueChange={(value: number[]) => setScale(value[0] / 100)}
              disabled={!file}
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            disabled={!file}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* 旋转控制 */}
        <Button
          variant="outline"
          size="icon"
          onClick={rotate}
          disabled={!file}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* PDF 查看区域 */}
      <div className="flex-1 overflow-auto border rounded-md p-4 bg-white dark:bg-gray-900 min-h-[500px] flex justify-center">
        {file ? (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
            className="flex justify-center"
            options={{
              cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/',
              cMapPacked: true,
              standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/standard_fonts/'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-md"
              />
            )}
          </Document>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="mb-4">请上传 PDF 文件或提供 PDF 链接</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 修复 ESLint 警告：将对象赋值给变量后再导出
// eslint-disable-next-line import/no-anonymous-default-export
export default { PDFViewer }; 