"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, SwitchCamera } from "lucide-react";
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
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载视频播放器...</span>
      </div>
    ),
  }
);

// 动态导入简单视频播放器组件，禁用 SSR
const SimpleVideoPlayer = dynamic(
  () =>
    import("@/components/reader/SimpleVideoPlayer").then(
      mod => mod.default.SimpleVideoPlayer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[500px] w-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载简单视频播放器...</span>
      </div>
    ),
  }
);

export default function VideoReaderPage() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("url");
  const [useSimplePlayer, setUseSimplePlayer] = useState<boolean>(false);

  // 默认视频示例
  const defaultVideoUrl = "https://oss.turinhub.com/atomix/AI_Mascot_Video.mp4";
  const defaultVideoPoster =
    "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg";

  // 切换播放器类型
  const togglePlayer = () => {
    setUseSimplePlayer(!useSimplePlayer);
    toast.success(`已切换到${!useSimplePlayer ? "简单" : "高级"}播放器`);
  };

  // 加载默认视频
  const loadDefaultVideo = () => {
    setIsLoading(true);

    // 检查默认视频是否可访问（仅在客户端环境）
    if (typeof window !== "undefined") {
      fetch(defaultVideoUrl, { method: "HEAD" })
        .then(response => {
          if (response.ok) {
            setCurrentVideo(defaultVideoUrl);
            setVideoUrl(defaultVideoUrl);
            toast.success("已加载示例视频");
          } else {
            toast.error("无法加载示例视频，请尝试其他视频");
          }
        })
        .catch(() => {
          toast.error("无法访问示例视频，请尝试其他视频");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 服务器端渲染时，直接设置视频 URL
      setCurrentVideo(defaultVideoUrl);
      setVideoUrl(defaultVideoUrl);
      setIsLoading(false);
    }
  };

  // 处理视频 URL 提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      setIsLoading(true);
      setCurrentVideo(videoUrl);
      toast.success("视频已加载");
      setIsLoading(false);
    } else {
      toast.error("请输入有效的视频 URL");
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

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="url">输入视频链接</TabsTrigger>
            <TabsTrigger value="example">使用示例视频</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="输入视频 URL"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    加载中
                  </>
                ) : (
                  "加载视频"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="example" className="space-y-4">
            <div className="flex items-center gap-2">
              <Button onClick={loadDefaultVideo} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    加载中
                  </>
                ) : (
                  "加载示例视频"
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                加载 AI_Mascot_Video.mp4 示例视频进行测试
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button variant="outline" onClick={togglePlayer} className="ml-2">
          <SwitchCamera className="h-4 w-4 mr-2" />
          切换到{useSimplePlayer ? "高级" : "简单"}播放器
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载视频中...</span>
        </div>
      ) : useSimplePlayer ? (
        <SimpleVideoPlayer
          src={currentVideo || undefined}
          poster={
            currentVideo === defaultVideoUrl ? defaultVideoPoster : undefined
          }
        />
      ) : (
        <VideoPlayer
          src={currentVideo || undefined}
          poster={
            currentVideo === defaultVideoUrl ? defaultVideoPoster : undefined
          }
        />
      )}

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">使用说明</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>您可以通过输入视频 URL 或加载示例视频来使用播放器</li>
          <li>支持的视频格式：MP4, WebM, Ogg 等主流格式</li>
          <li>如果高级播放器无法正常工作，请尝试切换到简单播放器</li>
          <li>简单播放器支持直接上传本地视频文件</li>
          <li>高级播放器提供更多控制选项和更好的播放体验</li>
        </ul>
      </div>
    </div>
  );
}
