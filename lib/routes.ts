import { FileText, Shield, LucideIcon, BookOpen, Bot, Globe } from "lucide-react";

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
        title: "地球可视化", 
        description: "使用 Google Maps 展示地球可视化", 
        path: "/gis/google-maps",
        url: "/gis/google-maps" 
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