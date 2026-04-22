import { NextRequest } from "next/server";
import { streamGraph } from "@/lib/agents/main-agent";
import { v4 as uuidv4 } from "uuid";

function serializeMessage(msg: Record<string, unknown>) {
  const result: Record<string, unknown> = {
    type:
      (msg._getType as (() => string) | undefined)?.() ?? msg.type ?? "unknown",
    content:
      typeof msg.content === "string"
        ? msg.content
        : Array.isArray(msg.content)
          ? msg.content
          : String(msg.content ?? ""),
  };

  if (msg.id) result.id = msg.id;
  if ("tool_calls" in msg && Array.isArray(msg.tool_calls)) {
    result.tool_calls = msg.tool_calls;
  }
  if ("tool_call_id" in msg && msg.tool_call_id) {
    result.tool_call_id = msg.tool_call_id;
  }
  if ("name" in msg && msg.name) {
    result.name = msg.name;
  }

  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, threadId } = body as {
      messages: Array<{ type: string; content: string }>;
      threadId?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages 不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resolvedThreadId = threadId || uuidv4();

    const eventStream = await streamGraph(messages, resolvedThreadId);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              `event: metadata\ndata: ${JSON.stringify({ threadId: resolvedThreadId })}\n\n`
            )
          );

          for await (const event of eventStream) {
            const serializedMessages = event.messages.map(msg =>
              serializeMessage(msg as unknown as Record<string, unknown>)
            );

            controller.enqueue(
              encoder.encode(
                `event: values\ndata: ${JSON.stringify({ messages: serializedMessages })}\n\n`
              )
            );
          }

          controller.enqueue(encoder.encode(`event: end\ndata: {}\n\n`));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "流式处理出错";
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify({ error: message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "服务器错误";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
