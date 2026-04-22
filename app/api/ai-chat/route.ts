import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const dashscope = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages?: UIMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "消息格式不正确" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = streamText({
      model: dashscope(process.env.CHAT_MODEL || "qwen-flash"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI对话API错误:", error);
    return new Response(JSON.stringify({ error: "处理请求时出错" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
