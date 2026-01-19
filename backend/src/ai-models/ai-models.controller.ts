import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AiModelsService } from './ai-models.service';
import { CreateAiModelDto, UpdateAiModelDto } from './dto/ai-model.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('ai-models')
@UseGuards(JwtAuthGuard)
export class AiModelsController {
  constructor(private aiModelsService: AiModelsService) {}

  @Get()
  findAll() {
    return this.aiModelsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.aiModelsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiModelsService.findOne(id);
  }
}
