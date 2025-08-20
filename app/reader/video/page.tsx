"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// 动态导入视频播放器组件，禁用 SSR
const VideoPlayer = dynamic(
  () =>
    import("@/components/reader/VideoPlayer").then(
      mod => mod.default.VideoPlayer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[500px] w-full">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    ),
  }
);

// 默认视频示例
const DEFAULT_VIDEO_URL = "https://oss.turinhub.com/atomix/AI_Mascot_Video.mp4";

export default function VideoReaderPage() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string>(DEFAULT_VIDEO_URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("AI 吉祥物演示视频");

  // 初始化时加载默认视频
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== "undefined") {
      loadDefaultVideo();
    }
  }, []);

  // 处理 URL 提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      setCurrentVideo(videoUrl);
      setTitle("自定义视频");
      toast.success("已加载视频 URL");
    } else {
      toast.error("请输入有效的视频 URL");
    }
  };

  // 加载默认视频
  const loadDefaultVideo = () => {
    setIsLoading(true);

    // 检查默认视频是否可访问（仅在客户端环境）
    if (typeof window !== "undefined") {
      fetch(DEFAULT_VIDEO_URL, { method: "HEAD" })
        .then(response => {
          if (response.ok) {
            setCurrentVideo(DEFAULT_VIDEO_URL);
            setTitle("AI 吉祥物演示视频");
            setVideoUrl(DEFAULT_VIDEO_URL);
            toast.success("已加载默认视频文件");
          } else {
            setCurrentVideo("");
            toast.error("默认视频文件无法访问");
          }
        })
        .catch(() => {
          setCurrentVideo("");
          toast.error("默认视频文件加载失败");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 服务器端渲染时不加载视频
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">视频播放器</h1>
        <p className="text-muted-foreground">
          上传本地视频文件或输入视频链接进行播放
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            支持多种视频格式的在线播放器
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={loadDefaultVideo} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中...
                </>
              ) : (
                "加载 demo.mp4"
              )}
            </Button>
          </div>

          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="输入视频 URL (如: https://example.com/video.mp4)"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                加载
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      ) : currentVideo ? (
        <VideoPlayer src={currentVideo} />
      ) : (
        <div className="flex justify-center items-center h-[500px] w-full border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-muted-foreground">请加载视频文件</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>功能特点</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>支持多种视频格式：MP4, WebM, Ogg 等</li>
            <li>响应式设计，适配不同屏幕尺寸</li>
            <li>支持播放控制：播放/暂停、音量调节、进度条</li>
            <li>支持全屏播放模式</li>
            <li>支持键盘快捷键操作</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
