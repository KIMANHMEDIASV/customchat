import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto, UpdateUserAdminDto } from './dto/admin-user.dto';
import { CreateAiModelDto, UpdateAiModelDto } from '../ai-models/dto/ai-model.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // User Management
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserAdminDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // AI Model Management
  @Get('models')
  getAllModels() {
    return this.adminService.getAllModels();
  }

  @Post('models')
  createModel(@Body() createModelDto: CreateAiModelDto) {
    return this.adminService.createModel(createModelDto);
  }

  @Put('models/:id')
  updateModel(@Param('id') id: string, @Body() updateModelDto: UpdateAiModelDto) {
    return this.adminService.updateModel(id, updateModelDto);
  }

  @Delete('models/:id')
  deleteModel(@Param('id') id: string) {
    return this.adminService.deleteModel(id);
  }

  // Usage Logs
  @Get('usage-logs')
  getUsageLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getUsageLogs(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('stats')
  getUserStats() {
    return this.adminService.getUserStats();
  }
}
