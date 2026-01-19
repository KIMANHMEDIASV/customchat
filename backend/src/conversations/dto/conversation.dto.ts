import { IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  modelId?: string;
}

export class UpdateConversationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  modelId?: string;
}
