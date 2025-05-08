/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 只为 PDF.js 相关模块设置 canvas = false
    // 不要全局禁用 canvas
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,  // 只在需要时禁用
      encoding: false,
    };
    
    return config;
  },
};

module.exports = nextConfig; 