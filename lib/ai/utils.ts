import { v4 as uuidv4 } from "uuid";
import { ChatMessage, OpenAIMessage } from "./types";

// 默认的系统提示词
export const DEFAULT_SYSTEM_PROMPT =
  "你是一个有用的AI助手。回答用户的问题时要简洁明了。";

// 创建一个新的聊天消息
export function createChatMessage(
  role: "system" | "user" | "assistant",
  content: string
): ChatMessage {
  return {
    id: uuidv4(),
    role,
    content,
    createdAt: new Date(),
  };
}

// 将聊天消息转换为 OpenAI 消息格式
export function chatMessagesToOpenAIMessages(
  messages: ChatMessage[]
): OpenAIMessage[] {
  return messages.map(message => ({
    role: message.role,
    content: message.content,
  }));
}

// 默认可用的模型列表
export const DEFAULT_MODELS = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "快速且经济实惠的模型",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "更强大的大型语言模型",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "更新的 GPT-4 版本",
  },
];

// 获取模型名称
export function getModelName(modelId: string): string {
  const model = DEFAULT_MODELS.find(m => m.id === modelId);
  return model ? model.name : modelId;
}
