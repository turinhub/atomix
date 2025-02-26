/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // 处理 PDF.js worker
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  },
};

module.exports = nextConfig; 