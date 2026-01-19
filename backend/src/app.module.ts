import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AiModelsModule } from './ai-models/ai-models.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { UsageLogsModule } from './usage-logs/usage-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AiModelsModule,
    ConversationsModule,
    ChatModule,
    AdminModule,
    UsageLogsModule,
  ],
})
export class AppModule {}
