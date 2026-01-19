export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AIModel {
  id: string;
  nameDisplay: string;
  provider: 'AZURE_OPENAI' | 'AZURE_FOUNDRY';
  endpointUrl: string;
  deploymentOrModelName: string;
  apiKeyEnvVar: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  tokensUsed?: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  modelId?: string;
  model?: AIModel;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface UsageLog {
  id: string;
  userId: string;
  modelId?: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  model?: {
    id: string;
    nameDisplay: string;
  };
}
