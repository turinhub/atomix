import { FileText, Shield, LucideIcon } from "lucide-react";

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
  }
];

// 首页导航项
export const homeNavItem = {
  title: "首页",
  url: "/",
  icon: FileText,
}; 