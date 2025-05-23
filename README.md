# Turinhub Atomix

常用网页模组项目，维护各类前端常用组件。

# 功能树

## 阅读与播放
- PDF 阅读器
- 视频播放器

## 安全与验证
- Cloudflare Turnstile

## AI 对话
- Deepseek Qwen 32B 对话（基于 Cloudflare AI）

## 动画
- Demo：https://excalidraw.com/，代码开源在 Githu：https://github.com/excalidraw/excalidraw/blob/master/excalidraw-app/index.html。

# 环境配置

项目使用 Next.js 14、TypeScript、Tailwind CSS 和 Shadcn UI 构建。

## 安装依赖

```bash
pnpm install
```

## 环境变量

复制 `.env.local.example` 文件为 `.env.local`，并填写相应的环境变量：

```bash
cp .env.local.example .env.local
```

### AI 对话配置

AI 对话功能使用 Cloudflare AI 的 Deepseek Qwen 32B 模型，需要设置以下环境变量：

- `CLOUDFLARE_API_TOKEN`: Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID

## 开发

```bash
pnpm dev
```

## 构建

```bash
pnpm build
```
