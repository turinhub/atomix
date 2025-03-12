import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './types';
import { DifyStreamEvent } from './dify-types';

// 默认的系统提示词
export const DIFY_SYSTEM_PROMPT = 
  "你是一个有用的AI助手，基于 DeepSeek R1 模型。回答用户的问题时要简洁明了。";

// 创建一个新的聊天消息
export function createDifyChatMessage(
  role: 'system' | 'user' | 'assistant',
  content: string
): ChatMessage {
  return {
    id: uuidv4(),
    role,
    content,
    createdAt: new Date(),
  };
}

// 将聊天历史转换为 Dify 查询
export function chatHistoryToDifyQuery(
  messages: ChatMessage[],
  latestUserMessage: string
): string {
  // 获取除了最新用户消息之外的历史消息
  const historyMessages = messages.filter(msg => msg.role !== 'system');
  
  // 如果没有历史消息，直接返回用户输入
  if (historyMessages.length === 0) {
    return latestUserMessage;
  }
  
  // 构建历史对话格式
  let historyText = "以下是之前的对话历史：\n\n";
  
  historyMessages.forEach(msg => {
    const role = msg.role === 'user' ? '用户' : '助手';
    historyText += `${role}: ${msg.content}\n\n`;
  });
  
  // 添加最新的用户问题
  historyText += "基于以上对话历史，请回答我的问题：\n\n";
  historyText += latestUserMessage;
  
  return historyText;
}

// 解析 SSE 数据
export function parseDifySSEData(data: string): DifyStreamEvent | null {
  if (!data || data === '[DONE]') {
    return null;
  }
  
  try {
    return JSON.parse(data) as DifyStreamEvent;
  } catch (error) {
    console.error('解析 SSE 数据错误:', error);
    return null;
  }
}

// 获取环境变量
export function getDifyConfig() {
  const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE || '';
  const apiKey = process.env.NEXT_PUBLIC_DIFY_CHATBOT_KEY || '';
  
  return {
    baseUrl,
    apiKey,
    isConfigured: Boolean(baseUrl && apiKey)
  };
} 