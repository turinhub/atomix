"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface SimpleVideoPlayerProps {
  src?: string;
  poster?: string;
}

export function SimpleVideoPlayer({ src, poster }: SimpleVideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(src || null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 处理视频文件上传
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      // 检查文件类型
      if (!file.type.startsWith("video/")) {
        toast.error("请上传有效的视频文件");
        return;
      }

      // 创建本地 URL
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      toast.success(`已加载视频: ${file.name}`);

      // 清理函数
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  // 处理视频 URL 输入
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      setVideoSrc(videoUrl);
      toast.success("已加载视频 URL");
    } else {
      toast.error("请输入有效的视频 URL");
    }
  };

  // 触发文件选择对话框
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 控制栏 */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded-md">
        {/* 文件上传 */}
        <div className="flex-1 min-w-[200px]">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="输入视频 URL 或上传视频文件"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline">
              加载
            </Button>
            <Button type="button" variant="outline" onClick={triggerFileInput}>
              <Upload className="h-4 w-4 mr-2" />
              上传
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </form>
        </div>
      </div>

      {/* 视频播放区域 */}
      <div className="flex-1 overflow-hidden border rounded-md bg-black min-h-[500px]">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={poster}
            controls
            className="w-full h-full"
            style={{ maxHeight: "500px" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p className="mb-4">请上传视频文件或提供视频链接</p>
            <Button variant="outline" onClick={triggerFileInput}>
              <Upload className="h-4 w-4 mr-2" />
              上传视频
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// 修复 ESLint 警告：将对象赋值给变量后再导出
// eslint-disable-next-line import/no-anonymous-default-export
export default { SimpleVideoPlayer };
