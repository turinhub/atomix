import { v4 as uuidv4 } from "uuid";
import { type Message } from "@langchain/langgraph-sdk";

export const DO_NOT_RENDER_ID_PREFIX = "do-not-render-";

export type ToolMessageLike = {
  type: "tool";
  tool_call_id: string;
  id: string;
  name: string;
  content: string;
};

export function ensureToolCallsHaveResponses(
  messages: Message[]
): ToolMessageLike[] {
  const newMessages: ToolMessageLike[] = [];

  messages.forEach((message, index) => {
    const msgAny = message as Record<string, unknown>;
    if (
      message.type !== "ai" ||
      !msgAny.tool_calls ||
      !Array.isArray(msgAny.tool_calls) ||
      (msgAny.tool_calls as unknown[]).length === 0
    ) {
      return;
    }

    const followingMessage = messages[index + 1];
    if (followingMessage && followingMessage.type === "tool") {
      return;
    }

    const toolCalls = msgAny.tool_calls as Array<{
      id?: string;
      name?: string;
    }>;

    newMessages.push(
      ...toolCalls.map(tc => ({
        type: "tool" as const,
        tool_call_id: tc.id ?? "",
        id: `${DO_NOT_RENDER_ID_PREFIX}${uuidv4()}`,
        name: tc.name ?? "",
        content: "工具调用已处理",
      }))
    );
  });

  return newMessages;
}
