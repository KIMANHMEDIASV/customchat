import { Module } from '@nestjs/common';
import { AiModelsService } from './ai-models.service';
import { AiModelsController } from './ai-models.controller';

@Module({
  controllers: [AiModelsController],
  providers: [AiModelsService],
  exports: [AiModelsService],
})
export class AiModelsModule {}
