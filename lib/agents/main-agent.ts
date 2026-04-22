import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const model = new ChatOpenAI({
  modelName: process.env.LANGGRAPH_MODEL || "gpt-4o-mini",
  temperature: 0.7,
  configuration: process.env.OPENAI_BASE_URL
    ? { baseURL: process.env.OPENAI_BASE_URL }
    : undefined,
});

// MemorySaver 仅适用于单进程开发环境，实例重启/扩容后上下文丢失
// 生产环境应替换为持久化 checkpointer（如 Redis、数据库）
const checkpointer = new MemorySaver();

const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "获取指定城市的天气信息",
  schema: z.object({
    city: z.string().describe("城市名称"),
  }),
  func: async ({ city }) => {
    return `${city}当前天气：晴，温度 25°C`;
  },
});

const agent = createReactAgent({
  llm: model,
  tools: [weatherTool],
  checkpointSaver: checkpointer,
});

export async function streamGraph(
  messages: Array<{ type: string; content: string }>,
  threadId: string
) {
  return agent.stream(
    {
      messages: messages.map(m => ({
        type: m.type,
        content: m.content,
      })),
    },
    {
      configurable: { thread_id: threadId },
      streamMode: "values" as const,
    }
  );
}

export async function invokeGraph(
  messages: Array<{ type: string; content: string }>,
  threadId: string
) {
  const result = await agent.invoke(
    {
      messages: messages.map(m => ({
        type: m.type,
        content: m.content,
      })),
    },
    {
      configurable: { thread_id: threadId },
    }
  );
  return result;
}
