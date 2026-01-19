# API Usage Guide & Examples

## Authentication

### Register a New User

**Request:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

**Request:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## User Profile Management

### Get User Profile

**Request:**
```bash
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Profile

**Request:**
```bash
curl -X PATCH http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "password": "newpassword123"
  }'
```

## AI Models

### Get Active Models

**Request:**
```bash
curl -X GET http://localhost:3001/ai-models/active \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
[
  {
    "id": "model-uuid",
    "nameDisplay": "GPT-4",
    "provider": "AZURE_OPENAI",
    "endpointUrl": "https://your-resource.openai.azure.com",
    "deploymentOrModelName": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2000,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Conversations

### Create New Conversation

**Request:**
```bash
curl -X POST http://localhost:3001/conversations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Chat",
    "modelId": "model-uuid"
  }'
```

**Response:**
```json
{
  "id": "conversation-uuid",
  "title": "My First Chat",
  "userId": "user-uuid",
  "modelId": "model-uuid",
  "model": {
    "id": "model-uuid",
    "nameDisplay": "GPT-4"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### List User Conversations

**Request:**
```bash
curl -X GET http://localhost:3001/conversations \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
[
  {
    "id": "conversation-uuid",
    "title": "My First Chat",
    "userId": "user-uuid",
    "modelId": "model-uuid",
    "model": {
      "id": "model-uuid",
      "nameDisplay": "GPT-4"
    },
    "messages": [
      {
        "id": "message-uuid",
        "role": "user",
        "content": "Hello!",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Conversation Details

**Request:**
```bash
curl -X GET http://localhost:3001/conversations/conversation-uuid \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "id": "conversation-uuid",
  "title": "My First Chat",
  "userId": "user-uuid",
  "modelId": "model-uuid",
  "model": {
    "id": "model-uuid",
    "nameDisplay": "GPT-4"
  },
  "messages": [
    {
      "id": "msg-1",
      "conversationId": "conversation-uuid",
      "role": "user",
      "content": "What is AI?",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "msg-2",
      "conversationId": "conversation-uuid",
      "role": "assistant",
      "content": "AI stands for Artificial Intelligence...",
      "tokensUsed": 50,
      "createdAt": "2024-01-01T00:00:01.000Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:01.000Z"
}
```

### Delete Conversation

**Request:**
```bash
curl -X DELETE http://localhost:3001/conversations/conversation-uuid \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Chat with AI

### Send Message

**Request:**
```bash
curl -X POST http://localhost:3001/chat/send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conversation-uuid",
    "content": "Explain quantum computing in simple terms",
    "modelId": "model-uuid"
  }'
```

**Response:**
```json
{
  "userMessage": {
    "id": "user-msg-uuid",
    "conversationId": "conversation-uuid",
    "role": "user",
    "content": "Explain quantum computing in simple terms",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "assistantMessage": {
    "id": "assistant-msg-uuid",
    "conversationId": "conversation-uuid",
    "role": "assistant",
    "content": "Quantum computing is a revolutionary approach to computation...",
    "tokensUsed": 250,
    "createdAt": "2024-01-01T00:00:02.000Z"
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 100,
    "total_tokens": 250
  }
}
```

## Admin Endpoints

### Get Dashboard Stats

**Request:**
```bash
curl -X GET http://localhost:3001/admin/stats \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Response:**
```json
{
  "totalUsers": 100,
  "activeUsers": 85,
  "totalConversations": 500,
  "totalMessages": 5000
}
```

### List All Users (Admin)

**Request:**
```bash
curl -X GET http://localhost:3001/admin/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Response:**
```json
[
  {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create User (Admin)

**Request:**
```bash
curl -X POST http://localhost:3001/admin/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User",
    "role": "USER",
    "isActive": true
  }'
```

### Create AI Model (Admin)

**Request:**
```bash
curl -X POST http://localhost:3001/admin/models \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nameDisplay": "GPT-4 Turbo",
    "provider": "AZURE_OPENAI",
    "endpointUrl": "https://your-resource.openai.azure.com",
    "deploymentOrModelName": "gpt-4-turbo",
    "apiKeyEnvVar": "AZURE_OPENAI_API_KEY",
    "temperature": 0.7,
    "maxTokens": 4000,
    "isActive": true
  }'
```

**Response:**
```json
{
  "id": "new-model-uuid",
  "nameDisplay": "GPT-4 Turbo",
  "provider": "AZURE_OPENAI",
  "endpointUrl": "https://your-resource.openai.azure.com",
  "deploymentOrModelName": "gpt-4-turbo",
  "apiKeyEnvVar": "AZURE_OPENAI_API_KEY",
  "temperature": 0.7,
  "maxTokens": 4000,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Usage Logs (Admin)

**Request:**
```bash
curl -X GET "http://localhost:3001/admin/usage-logs?page=1&limit=50" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Response:**
```json
{
  "logs": [
    {
      "id": "log-uuid",
      "userId": "user-uuid",
      "modelId": "model-uuid",
      "promptTokens": 150,
      "completionTokens": 100,
      "totalTokens": 250,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "model": {
        "id": "model-uuid",
        "nameDisplay": "GPT-4"
      }
    }
  ],
  "total": 1000,
  "page": 1,
  "totalPages": 20
}
```

## Frontend Integration Examples

### React Hook - useChat

```typescript
// Example custom hook for chat functionality
import { useState } from 'react';
import { chatAPI } from '@/lib/api';

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string, modelId?: string) => {
    setLoading(true);
    try {
      const response = await chatAPI.sendMessage({
        conversationId,
        content,
        modelId,
      });
      
      const { userMessage, assistantMessage } = response.data;
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
}
```

### React Component - Chat Interface

```typescript
'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';

export default function ChatInterface({ conversationId }: { conversationId: string }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, loading } = useChat(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block p-3 rounded-lg mb-2">
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
          className="w-full p-2 border rounded"
        />
      </form>
    </div>
  );
}
```

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Conversation not found"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Invalid or inactive AI model"
}
```

## Rate Limiting

The API does not currently implement rate limiting, but you should add it in production:

```typescript
// Example rate limiting implementation
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('chat')
export class ChatController {
  // Limited to 10 requests per minute per user
}
```

## WebSocket Support (Future)

For real-time streaming responses, you can add WebSocket support:

```typescript
// Backend WebSocket Gateway
@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: any) {
    // Stream response from Azure OpenAI
    const stream = await this.streamAIResponse(payload);
    
    for await (const chunk of stream) {
      client.emit('messageChunk', chunk);
    }
    
    client.emit('messageComplete');
  }
}
```

## Best Practices

1. **Token Management:**
   - Store access token in memory (state management)
   - Store refresh token in httpOnly cookie (more secure)
   - Implement token refresh logic

2. **Error Handling:**
   - Always handle API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging

3. **Performance:**
   - Implement pagination for long conversations
   - Cache AI model list
   - Debounce user input

4. **Security:**
   - Never expose API keys in frontend
   - Validate all user inputs
   - Implement CSRF protection
   - Use HTTPS in production

## Testing

### Example Test with Jest

```typescript
describe('ChatService', () => {
  it('should send message and get AI response', async () => {
    const response = await chatService.sendMessage(userId, {
      conversationId: 'test-conv-id',
      content: 'Hello AI',
      modelId: 'test-model-id',
    });

    expect(response.userMessage.content).toBe('Hello AI');
    expect(response.assistantMessage.role).toBe('assistant');
    expect(response.usage.total_tokens).toBeGreaterThan(0);
  });
});
```

## Monitoring and Analytics

### Track API Usage

```typescript
// Middleware to log API requests
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  }
}
```

### Monitor AI Costs

```typescript
// Calculate costs based on token usage
const calculateCost = (usage: Usage) => {
  const promptCost = (usage.prompt_tokens / 1000) * 0.03; // $0.03 per 1K tokens
  const completionCost = (usage.completion_tokens / 1000) * 0.06; // $0.06 per 1K tokens
  return promptCost + completionCost;
};
```

## Support

For more examples and help:
- Check the source code in the repository
- Review the ARCHITECTURE.md for system design
- See SETUP_GUIDE.md for installation help
- Open an issue on GitHub for bugs or questions
