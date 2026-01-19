import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('send')
  async sendMessage(@CurrentUser() user: any, @Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(user.userId, sendMessageDto);
  }
}
