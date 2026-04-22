# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.19] - 2026-04-22

- 升级 Next.js 16.0.10 → 16.2.4，字体加载改为本地 woff2 文件
- 增加 LangGraph Agent 对话页面，支持工具调用和多轮对话流式响应
- 重构 AI 对话页面：使用 Vercel AI SDK（useChat + streamText）替代手动 SSE 实现，后端切换到阿里云 DashScope（Qwen Flash）
- 移除 Dify API 对话功能及相关代码
- 清理 11 个未使用的 npm 依赖

## [0.1.18] - 2025-08-23

- 增加 PDF 阅读器（简洁版）

## [0.1.17] - 2025-08-19

- 增加视频播放页面
- 更新 PDF 页面
- 增加 WORD、PPT 展示页面

## [0.1.16] - 2025-08-15

- 增加知识图谱

## [0.1.15] - 2025-07-18

- 增加 AI 对话、AI 图像生成
- 删除原先的 Cloudflare 对话服务
- 增加 Prettier 格式化代码

## [0.1.14] - 2025-06-17

- 增加 Markdown 在线编辑器
- 增加 LaTeX 在线编辑器
- 增加导航栏搜索

## [0.1.13] - 2025-06-09

- 增加 Office Spreadsheet 案例

## [0.1.11] - [0.1.12] - 2025-05-23

- 增加 Globe.gl 案例
- 拆分高德地图和 Mapbox

## [0.1.10] - 2025-05-08

- 增加 Excalidraw 演示页面

## [0.1.9] - 2025-04-22

- 增加 PixiJS 动画演示页面

## [0.1.8] - 2025-04-21

- 增加 KeplerGL 基础 Demo

## [0.1.7] - 2025-04-20

- 增加高德地图碳排放地图 Demo，增加对 Mapbox 的支持

## [0.1.6] - 2025-04-17

- 增加 GIS 目录

## [0.1.5] - 2025-03-13

- 优化对话页面的思考过程隐藏机制

## [0.1.2] - [0.1.4] - 2025-03-12

- 增加 AI 对话页面，兼容 Cloudflare API
- 增加 Dify 对话页面，允许隐藏思考过程

## [0.1.0] - [0.1.1] - 2025-02-26

- 新增 PDF 浏览器、视频播放器
- 新增 Cloudflare Turnstile 示例页面
- 项目初始化
