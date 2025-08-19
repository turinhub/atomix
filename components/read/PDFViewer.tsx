"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2,
  SidebarClose,
  SidebarOpen,
  ScrollText,
  FileText,
} from "lucide-react";
import debounce from "lodash/debounce";
import { useHotkeys } from "react-hotkeys-hook";
import { PDFSidebar } from "./PDFSidebar";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUri: string;
  title: string;
}

export default function PDFViewer({ pdfUri, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(0.7);
  const [rotation, setRotation] = useState(0);
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy | null>(
    null
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAllPages, setShowAllPages] = useState(true);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 处理文档加载成功
  const onDocumentLoadSuccess = (pdf: pdfjs.PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
    setPdfDocument(pdf);
    setLoading(false);
    setError(null);
  };

  // 处理加载错误
  const onDocumentLoadError = (error: Error) => {
    setError("PDF加载失败，请稍后重试");
    setLoading(false);
  };

  // 页面导航
  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, numPages));
    setPageNumber(newPage);

    // 滚动到目标页面
    if (pageRefs.current[newPage]) {
      const targetElement = pageRefs.current[newPage];
      const container = targetElement?.closest(".pdf-container");

      if (targetElement && container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const scrollOffset =
          targetRect.top - containerRect.top + container.scrollTop;

        container.scrollTo({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    }
  };

  // 缩放控制
  const zoom = (delta: number) => {
    setScale(prevScale => {
      const newScale = prevScale + delta;
      return Math.max(0.5, Math.min(2.5, newScale));
    });
  };

  // 旋转控制
  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // 防抖处理窗口大小变化
  const updatePageWidth = useCallback(
    debounce((ref: HTMLDivElement | null) => {
      if (ref) {
        setPageWidth(ref.clientWidth);
      }
    }, 100),
    []
  );

  // 键盘快捷键
  useHotkeys("left", () => goToPage(pageNumber - 1), [pageNumber]);
  useHotkeys("right", () => goToPage(pageNumber + 1), [pageNumber]);
  useHotkeys("ctrl+=", () => zoom(0.1), []);
  useHotkeys("ctrl+-", () => zoom(-0.1), []);

  // 清理函数
  useEffect(() => {
    return () => {
      updatePageWidth.cancel();
    };
  }, [updatePageWidth]);

  // 添加全屏切换函数
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error("Error attempting to enable fullscreen:", error);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 添加页面可见性检测函数
  const setupIntersectionObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        const visiblePagesSet = new Set<number>();

        entries.forEach(entry => {
          const pageNum = parseInt(
            entry.target.getAttribute("data-page-number") || "1"
          );
          if (entry.isIntersecting) {
            visiblePagesSet.add(pageNum);
          }
        });

        if (visiblePagesSet.size > 0) {
          setVisiblePages(visiblePagesSet);
          // 更新当前页码为可见页面中的第一个
          const currentVisible = Math.min(...Array.from(visiblePagesSet));
          setPageNumber(currentVisible);
        }
      },
      {
        threshold: 0.5, // 页面可见面积超过 50% 时触发
      }
    );

    // 观察所有页面
    document.querySelectorAll("[data-page-number]").forEach(page => {
      observerRef.current?.observe(page);
    });
  }, []);

  // 在页面渲染后设置观察器
  useEffect(() => {
    if (showAllPages && numPages > 0) {
      // 等待页面完全渲染后再设置观察器
      setTimeout(setupIntersectionObserver, 100);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [showAllPages, numPages, setupIntersectionObserver]);

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex items-center gap-2 p-2 bg-muted border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? (
            <SidebarClose className="h-4 w-4" />
          ) : (
            <SidebarOpen className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={e => goToPage(parseInt(e.target.value) || 1)}
            className="w-16 text-center"
          />
          <span className="text-sm text-muted-foreground">/ {numPages}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(pageNumber + 1)}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoom(-0.1)}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoom(0.1)}
            disabled={scale >= 2.5}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAllPages(!showAllPages)}
            title={showAllPages ? "单页模式" : "滚动模式"}
          >
            {showAllPages ? (
              <ScrollText className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <PDFSidebar
            pdfDocument={pdfDocument}
            currentPage={pageNumber}
            onPageClick={goToPage}
          />
        )}

        {/* PDF 显示区域 */}
        <div
          ref={ref => updatePageWidth(ref)}
          className="flex-1 overflow-y-auto pdf-container"
        >
          <div className="flex justify-center min-h-full px-4">
            <Document
              file={pdfUri}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="w-full max-w-4xl flex flex-col items-center gap-4">
                  <Skeleton className="w-full h-[450px]" />
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      加载中...
                    </span>
                  </div>
                </div>
              }
            >
              {error ? (
                <div className="text-destructive text-center py-8">{error}</div>
              ) : showAllPages ? (
                // 显示所有页面模式
                Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="mb-4"
                    data-page-number={index + 1}
                    ref={el => {
                      if (el) {
                        pageRefs.current[index + 1] = el;
                      }
                    }}
                  >
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={pageWidth}
                      scale={scale}
                      rotate={rotation}
                    />
                  </div>
                ))
              ) : (
                // 单页模式
                <div
                  ref={el => {
                    if (el) {
                      pageRefs.current[pageNumber] = el;
                    }
                  }}
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={pageWidth}
                    scale={scale}
                    rotate={rotation}
                  />
                </div>
              )}
            </Document>
          </div>
        </div>
      </div>

      {/* 移动端页面导航 */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一页
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => goToPage(pageNumber + 1)}
          disabled={pageNumber >= numPages}
        >
          下一页
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
