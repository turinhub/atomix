import { FileText, Shield, LucideIcon, BookOpen, Bot, Globe, Sparkles } from "lucide-react";

export type ToolItem = {
  name: string;
  title: string;
  description: string;
  path: string;
  url: string;
};

export type ToolCategory = {
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
  tools: ToolItem[];
};

export const toolCategories: ToolCategory[] = [
  {
    title: "阅读与播放",
    description: "文档阅读和媒体播放工具",
    icon: BookOpen,
    url: "/reader",
    tools: [
      { 
        name: "PDF 阅读器", 
        title: "PDF 阅读器", 
        description: "在线 PDF 文档阅读工具", 
        path: "/reader/pdf",
        url: "/reader/pdf" 
      },
      { 
        name: "视频播放器", 
        title: "视频播放器", 
        description: "在线视频播放工具", 
        path: "/reader/video",
        url: "/reader/video" 
      }
    ]
  },
  {
    title: "安全与验证",
    description: "保护网站免受自动化攻击的安全工具",
    icon: Shield,
    url: "/safe",
    tools: [
      { 
        name: "Cloudflare Turnstile", 
        title: "Cloudflare Turnstile", 
        description: "Cloudflare Turnstile 人机验证工具", 
        path: "/safe/turnstile",
        url: "/safe/turnstile" 
      },
      { 
        name: "Cloudflare Turnstile 受保护的页面", 
        title: "受保护的页面（Turnstile）", 
        description: "受保护的页面（Cloudflare Turnstile）", 
        path: "/safe/protected",
        url: "/safe/protected" 
      }
    ]
  },
  {
    title: "AI 对话",
    description: "人工智能对话和交互工具",
    icon: Bot,
    url: "/ai",
    tools: [
      { 
        name: "Cloudflare AI API 对话", 
        title: "Cloudflare AI API 对话", 
        description: "使用 Cloudflare AI API，使用 Deepseek Qwen 32B", 
        path: "/ai/chat",
        url: "/ai/chat" 
      },
      { 
        name: "Dify API 对话", 
        title: "Dify API 对话", 
        description: "基于 Dify API 的对话工具，使用 DeepSeek R1", 
        path: "/ai/dify-chat",
        url: "/ai/dify-chat" 
      }
    ]
  },
  {
    title: "地理可视化",
    description: "地理数据的可视化工具",
    icon: Globe,
    url: "/gis",
    tools: [
      { 
        name: "Google Maps", 
        title: "谷歌地图", 
        description: "使用 Google Maps 展示地球可视化", 
        path: "/gis/google-map",
        url: "/gis/google-map" 
      },
      { 
        name: "高德地图", 
        title: "高德地图", 
        description: "基于高德地图的碳排放可视化，专注中国地区数据", 
        path: "/gis/gaode-map",
        url: "/gis/gaode-map" 
      },
      { 
        name: "Mapbox 地图", 
        title: "Mapbox 地图", 
        description: "基于 Mapbox 的多样化地理数据可视化，支持多种样式和格式", 
        path: "/gis/mapbox-map",
        url: "/gis/mapbox-map" 
      },
      { 
        name: "Kepler.gl", 
        title: "Kepler.gl 地图", 
        description: "使用 Kepler.gl 进行大规模地理数据可视化", 
        path: "/gis/kepler-map",
        url: "/gis/kepler-map" 
      },
      { 
        name: "Globe.gl 热力图", 
        title: "Globe.gl 地球热力图", 
        description: "基于 Globe.gl 的 3D 地球热力图可视化，展示全球数据分布", 
        path: "/animation/globe-heatmap",
        url: "/animation/globe-heatmap" 
      }
    ]
  },
  {
    title: "动画效果",
    description: "交互式动画和图形效果展示",
    icon: Sparkles,
    url: "/animation",
    tools: [
      { 
        name: "PixiJS 示例", 
        title: "PixiJS 动画示例", 
        description: "使用 PixiJS 创建的简单交互式图形动画示例", 
        path: "/animation/pixi",
        url: "/animation/pixi" 
      },
      { 
        name: "Excalidraw 绘图", 
        title: "Excalidraw 绘图工具", 
        description: "基于 Excalidraw 的手绘风格白板绘图工具演示", 
        path: "/animation/excalidraw",
        url: "/animation/excalidraw" 
      }
    ]
  }
];

// 首页导航项
export const homeNavItem = {
  title: "首页",
  url: "/",
  icon: FileText,
};