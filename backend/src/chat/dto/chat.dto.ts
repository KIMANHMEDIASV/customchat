import { IsString, IsArray, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  modelId?: string;
}
