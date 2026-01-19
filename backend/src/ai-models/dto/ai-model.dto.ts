import { IsString, IsEnum, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

enum AIProvider {
  AZURE_OPENAI = 'AZURE_OPENAI',
  AZURE_FOUNDRY = 'AZURE_FOUNDRY',
}

export class CreateAiModelDto {
  @IsString()
  nameDisplay: string;

  @IsEnum(AIProvider)
  provider: AIProvider;

  @IsString()
  endpointUrl: string;

  @IsString()
  deploymentOrModelName: string;

  @IsString()
  @IsOptional()
  apiKeyEnvVar?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxTokens?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAiModelDto {
  @IsString()
  @IsOptional()
  nameDisplay?: string;

  @IsEnum(AIProvider)
  @IsOptional()
  provider?: AIProvider;

  @IsString()
  @IsOptional()
  endpointUrl?: string;

  @IsString()
  @IsOptional()
  deploymentOrModelName?: string;

  @IsString()
  @IsOptional()
  apiKeyEnvVar?: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxTokens?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
