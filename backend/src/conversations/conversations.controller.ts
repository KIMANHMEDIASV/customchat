import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(user.userId, createConversationDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.conversationsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(id, user.userId, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.conversationsService.remove(id, user.userId);
  }
}
