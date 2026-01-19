import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: createConversationDto.title || 'New Chat',
        modelId: createConversationDto.modelId,
      },
      include: {
        model: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      include: {
        model: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        model: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return conversation;
  }

  async update(id: string, userId: string, updateConversationDto: UpdateConversationDto) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.conversation.update({
      where: { id },
      data: updateConversationDto,
      include: {
        model: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.conversation.delete({
      where: { id },
    });
  }
}
