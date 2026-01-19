import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsageLogsService } from './usage-logs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('usage-logs')
@UseGuards(JwtAuthGuard)
export class UsageLogsController {
  constructor(private usageLogsService: UsageLogsService) {}

  @Get()
  getUserUsageLogs(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usageLogsService.getUserUsageLogs(
      user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }
}
