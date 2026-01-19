import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/chat.dto';
import axios from 'axios';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const { conversationId, content, modelId } = sendMessageDto;

    // Verify conversation ownership
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { model: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.userId !== userId) {
      throw new BadRequestException('Access denied');
    }

    // Determine which model to use
    let aiModel = conversation.model;
    if (modelId) {
      aiModel = await this.prisma.aIModel.findUnique({
        where: { id: modelId },
      });
      
      if (!aiModel || !aiModel.isActive) {
        throw new BadRequestException('Invalid or inactive AI model');
      }

      // Update conversation model
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { modelId },
      });
    }

    if (!aiModel) {
      throw new BadRequestException('No AI model configured for this conversation');
    }

    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content,
      },
    });

    // Get conversation history
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 20, // Limit history
    });

    // Prepare messages for API
    const apiMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Azure OpenAI/Foundry
    try {
      const response = await this.callAzureAI(aiModel, apiMessages);

      const assistantContent = response.choices[0]?.message?.content || 'No response';
      const usage = response.usage;

      // Save assistant message
      const assistantMessage = await this.prisma.message.create({
        data: {
          conversationId,
          role: 'assistant',
          content: assistantContent,
          tokensUsed: usage?.total_tokens,
        },
      });

      // Log usage
      if (usage) {
        await this.prisma.usageLog.create({
          data: {
            userId,
            modelId: aiModel.id,
            promptTokens: usage.prompt_tokens || 0,
            completionTokens: usage.completion_tokens || 0,
            totalTokens: usage.total_tokens || 0,
          },
        });
      }

      // Update conversation title if first message
      if (messages.length === 1) {
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        await this.prisma.conversation.update({
          where: { id: conversationId },
          data: { title },
        });
      }

      return {
        userMessage,
        assistantMessage,
        usage,
      };
    } catch (error) {
      console.error('Azure AI API Error:', error.response?.data || error.message);
      throw new BadRequestException(
        `Failed to get AI response: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  private async callAzureAI(model: any, messages: any[]) {
    const apiKey = process.env[model.apiKeyEnvVar] || process.env.AZURE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new BadRequestException('API key not configured');
    }

    const endpoint = model.endpointUrl;
    const deployment = model.deploymentOrModelName;
    
    // Construct URL based on provider
    let url: string;
    if (model.provider === 'AZURE_OPENAI') {
      // Azure OpenAI format
      url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`;
    } else {
      // Azure Foundry format (adjust as needed)
      url = `${endpoint}/chat/completions`;
    }

    const response = await axios.post(
      url,
      {
        messages,
        temperature: model.temperature,
        max_tokens: model.maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        timeout: 60000,
      },
    );

    return response.data;
  }
}
