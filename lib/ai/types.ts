export type ChatMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: Date;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

export type OpenAIModel = {
  id: string;
  name: string;
  description?: string;
};

export type OpenAIModels = OpenAIModel[];

export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenAIChatCompletionRequest = {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  max_tokens?: number;
};

export type OpenAIChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}; 