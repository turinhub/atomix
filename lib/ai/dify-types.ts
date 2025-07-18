// Dify API 相关类型定义

// 请求类型
export type DifyCompletionRequest = {
  inputs: {
    query: string;
  };
  response_mode: "streaming" | "blocking";
  user?: string;
  files?: Array<{
    type: string;
    transfer_method: "remote_url" | "local_file";
    url?: string;
    upload_file_id?: string;
  }>;
};

// 阻塞模式响应类型
export type DifyCompletionResponse = {
  message_id: string;
  mode: string;
  answer: string;
  metadata: Record<string, unknown>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  retriever_resources?: Array<Record<string, unknown>>;
  created_at: number;
};

// 流式响应事件类型
export type DifyStreamEvent =
  | DifyMessageEvent
  | DifyMessageEndEvent
  | DifyTTSMessageEvent
  | DifyTTSMessageEndEvent
  | DifyMessageReplaceEvent
  | DifyErrorEvent;

// 消息事件
export type DifyMessageEvent = {
  event: "message";
  task_id: string;
  message_id: string;
  answer: string;
  created_at: number;
};

// 消息结束事件
export type DifyMessageEndEvent = {
  event: "message_end";
  task_id: string;
  message_id: string;
  metadata: Record<string, unknown>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  retriever_resources?: Array<Record<string, unknown>>;
  created_at?: number;
};

// TTS 消息事件
export type DifyTTSMessageEvent = {
  event: "tts_message";
  task_id: string;
  message_id: string;
  audio: string; // base64 编码的音频数据
  created_at: number;
};

// TTS 消息结束事件
export type DifyTTSMessageEndEvent = {
  event: "tts_message_end";
  task_id: string;
  message_id: string;
  audio: string; // 空字符串
  created_at: number;
};

// 消息替换事件
export type DifyMessageReplaceEvent = {
  event: "message_replace";
  task_id: string;
  message_id: string;
  answer: string;
  created_at: number;
};

// 错误事件
export type DifyErrorEvent = {
  event: "error";
  task_id: string;
  message_id: string;
  status: number;
  code: string;
  message: string;
};
