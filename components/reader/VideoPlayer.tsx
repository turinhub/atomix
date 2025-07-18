"use client";

import { useState, useRef, useEffect } from "react";
import Plyr, { APITypes } from "plyr-react";
import "plyr-react/plyr.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(src || null);
  const [videoPoster, setVideoPoster] = useState<string | null>(poster || null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plyrRef = useRef<APITypes>(null);

  // 当传入的 src 或 poster 改变时更新状态
  useEffect(() => {
    if (src) {
      setVideoSrc(src);
    }
    if (poster) {
      setVideoPoster(poster);
    }
  }, [src, poster]);

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
      setVideoPoster(null);
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
      setVideoPoster(null);
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

  // Plyr 配置
  const plyrOptions = {
    controls: [
      "play-large", // 播放按钮
      "play", // 播放/暂停按钮
      "progress", // 进度条
      "current-time", // 当前时间
      "duration", // 总时长
      "mute", // 静音按钮
      "volume", // 音量控制
      "settings", // 设置按钮
      "pip", // 画中画
      "fullscreen", // 全屏按钮
    ],
    i18n: {
      restart: "重新开始",
      play: "播放",
      pause: "暂停",
      fastForward: "快进",
      rewind: "快退",
      seek: "跳转",
      played: "已播放",
      buffered: "已缓冲",
      currentTime: "当前时间",
      duration: "总时长",
      volume: "音量",
      mute: "静音",
      unmute: "取消静音",
      enableCaptions: "启用字幕",
      disableCaptions: "禁用字幕",
      enterFullscreen: "全屏",
      exitFullscreen: "退出全屏",
      frameTitle: "视频播放器",
      captions: "字幕",
      settings: "设置",
      speed: "速度",
      normal: "正常",
      quality: "质量",
      loop: "循环",
      start: "开始",
      end: "结束",
      all: "全部",
      reset: "重置",
      disabled: "禁用",
      advertisement: "广告",
      pip: "画中画",
    },
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
          <Plyr
            ref={plyrRef}
            source={{
              type: "video",
              sources: [
                {
                  src: videoSrc,
                  type: "video/mp4", // 默认类型，实际会根据视频自动检测
                },
              ],
              poster: videoPoster || undefined,
            }}
            options={plyrOptions}
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
const VideoPlayerModule = { VideoPlayer };
export default VideoPlayerModule;
