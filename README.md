# Turinhub Atomix

常用网页模组项目，维护各类前端常用组件。

# 功能树

## 阅读与播放

- PDF 阅读器
- 视频播放器

## 安全与验证

- Cloudflare Turnstile

## AI 对话

- Qwen 对话（基于 OpenAI 兼容接口）

## 动画

- Demo：https://excalidraw.com/，代码开源在 Githu：https://github.com/excalidraw/excalidraw/blob/master/excalidraw-app/index.html。

# 环境配置

项目使用 Next.js 14、TypeScript、Tailwind CSS 和 Shadcn UI 构建。

## 安装依赖

```bash
pnpm install
```

## 环境变量

复制 `.env.example` 文件为 `.env.local`，并填写相应的环境变量：

```bash
cp .env.example .env.local
```

### AI 对话配置

AI 对话功能使用 OpenAI 兼容接口，需要设置以下环境变量：

- `OPENAI_BASE_URL`: OpenAI 兼容接口地址
- `OPENAI_API_KEY`: 接口密钥
- `CHAT_MODEL`: 对话模型名称，例如 `qwen-flash`

### Cloudflare 配置

部分能力仍使用 Cloudflare 服务，例如图片生成和 Turnstile 验证，需要设置以下环境变量：

- `CLOUDFLARE_API_TOKEN`: Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY`: Turnstile 站点 Key
- `CLOUDFLARE_TURNSTILE_SECRETKEY`: Turnstile 密钥

## 开发

```bash
pnpm dev
```

## 构建

```bash
pnpm build
```
