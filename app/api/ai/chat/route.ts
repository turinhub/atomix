import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import { OpenAIChatCompletionRequest } from '@/lib/ai/types';
import { ChatCompletion } from 'openai/resources';

// 环境变量
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// 固定使用的模型
const FIXED_MODEL = "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b";

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: CLOUDFLARE_API_TOKEN,
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/v1`
});

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const requestData: OpenAIChatCompletionRequest = await request.json();

    // 验证请求数据
    if (!requestData.messages || requestData.messages.length === 0) {
      return NextResponse.json(
        { error: '无效的请求数据' },
        { status: 400 }
      );
    }

    // 检查 API 密钥是否配置
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
      return NextResponse.json(
        { error: 'Cloudflare API 配置未设置' },
        { status: 500 }
      );
    }

    try {
      // 调用 OpenAI API，始终使用固定模型
      const chatCompletion = await openai.chat.completions.create({
        messages: requestData.messages,
        model: FIXED_MODEL,
        temperature: requestData.temperature || 0.7,
        max_tokens: requestData.max_tokens || 2048,
        stream: requestData.stream,
      });

      // 处理流式响应
      if (requestData.stream) {
        // 创建一个 ReadableStream 来处理流式响应
        const stream = new ReadableStream({
          async start(controller) {
            try {
              // @ts-expect-error - SDK 类型定义问题，流式响应的类型处理
              for await (const chunk of chatCompletion) {
                // 处理 Cloudflare AI 的流式响应格式
                let content = '';
                
                if (chunk.choices && chunk.choices[0]) {
                  if (chunk.choices[0].delta?.content) {
                    content = chunk.choices[0].delta.content;
                  } else if (chunk.choices[0].delta?.function_call) {
                    // 处理函数调用（如果有）
                    content = '';
                  }
                }
                
                // 不再过滤 </think> 标签，保留它用于前端处理
                
                if (content) {
                  // 发送 SSE 格式的数据
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content, role: 'assistant' })}\n\n`));
                }
              }
              
              // 发送结束标记
              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            } catch (error) {
              console.error('流式处理错误:', error);
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ error: '流式处理错误' })}\n\n`)
              );
            } finally {
              controller.close();
            }
          },
        });

        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }

      // 处理非流式响应
      // 使用类型断言确保 TypeScript 理解这是一个非流式响应
      const completionResponse = chatCompletion as ChatCompletion;
      const assistantMessage = completionResponse.choices[0].message;
      
      // 不再过滤 </think> 标签，保留它用于前端处理
      const content = assistantMessage.content || '';

      // 返回简化的响应格式
      return NextResponse.json({
        content: content,
        role: assistantMessage.role,
      });
    } catch (error) {
      console.error("AI 对话 API 错误:", error);
      const errorMessage = error instanceof Error ? error.message : '请求 AI API 失败';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AI 对话 API 错误:", error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 