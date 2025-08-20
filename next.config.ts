import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: config => {
    // 只为 PDF.js 相关模块设置 canvas = false
    // 不要全局禁用 canvas
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // 只在需要时禁用
      encoding: false,
    };

    return config;
  },
  async headers() {
    return [
      {
        // 匹配所有路由
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // 允许所有域名访问，生产环境建议指定具体域名
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
