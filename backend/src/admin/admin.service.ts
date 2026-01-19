import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserAdminDto } from './dto/admin-user.dto';
import { CreateAiModelDto, UpdateAiModelDto } from '../ai-models/dto/ai-model.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // User Management
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserAdminDto) {
    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // AI Model Management
  async getAllModels() {
    return this.prisma.aIModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createModel(createModelDto: CreateAiModelDto) {
    return this.prisma.aIModel.create({
      data: createModelDto,
    });
  }

  async updateModel(id: string, updateModelDto: UpdateAiModelDto) {
    return this.prisma.aIModel.update({
      where: { id },
      data: updateModelDto,
    });
  }

  async deleteModel(id: string) {
    return this.prisma.aIModel.delete({
      where: { id },
    });
  }

  // Usage Logs
  async getUsageLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.usageLog.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          model: {
            select: {
              id: true,
              nameDisplay: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.usageLog.count(),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserStats() {
    const [totalUsers, activeUsers, totalConversations, totalMessages] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.conversation.count(),
      this.prisma.message.count(),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalConversations,
      totalMessages,
    };
  }
}
