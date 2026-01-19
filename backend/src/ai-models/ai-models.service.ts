import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAiModelDto, UpdateAiModelDto } from './dto/ai-model.dto';

@Injectable()
export class AiModelsService {
  constructor(private prisma: PrismaService) {}

  async create(createAiModelDto: CreateAiModelDto) {
    return this.prisma.aIModel.create({
      data: createAiModelDto,
    });
  }

  async findAll() {
    return this.prisma.aIModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.aIModel.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const model = await this.prisma.aIModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('AI Model not found');
    }

    return model;
  }

  async update(id: string, updateAiModelDto: UpdateAiModelDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.aIModel.update({
      where: { id },
      data: updateAiModelDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.aIModel.delete({
      where: { id },
    });
  }
}
