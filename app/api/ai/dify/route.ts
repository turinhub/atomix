// 环境变量
const DIFY_BASE_URL = process.env.DIFY_BASE;
const DIFY_API_KEY = process.env.DIFY_CHATBOT_KEY;

export async function POST(req: Request) {
  try {
    // 获取环境变量
    if (!DIFY_API_KEY || !DIFY_BASE_URL) {
      return Response.json(
        { error: "Dify API 配置缺失" },
        { status: 500 }
      );
    }

    // 解析请求数据
    const data = await req.json();
    const { inputs, response_mode, user } = data;

    if (!inputs || !inputs.query) {
      return Response.json(
        { error: "请求数据无效" },
        { status: 400 }
      );
    }

    // 准备请求数据
    const requestData = {
      inputs,
      query: inputs.query,
      response_mode: response_mode || "blocking", // 默认使用 blocking 模式
      user: user || "anonymous",
    };

    // 发送请求到 Dify API
    const difyResponse = await fetch(`${DIFY_BASE_URL}/v1/completion-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!difyResponse.ok) {
      const errorData = await difyResponse.json();
      return Response.json(
        { error: errorData.message || "Dify API 请求失败" },
        { status: difyResponse.status }
      );
    }

    // 处理 blocking 模式响应
    if (response_mode === "blocking" || !response_mode) {
      const responseData = await difyResponse.json();
      return Response.json(responseData);
    }

    // 处理 streaming 模式响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          if (!difyResponse.body) {
            controller.close();
            return;
          }

          const reader = difyResponse.body.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              // 直接传递 SSE 格式的数据，不做任何修改或解析
              controller.enqueue(encoder.encode(chunk));
            }
          } catch (error) {
            console.error("流式处理错误:", error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Dify API 处理错误:", error);
    return Response.json(
      { error: "处理请求时出错" },
      { status: 500 }
    );
  }
} 