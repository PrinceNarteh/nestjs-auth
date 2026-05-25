import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from 'src/database/schemas';
import { CreateTaskDTO } from './dto/create-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: ' Get all tasks for current user' })
  findAll(@CurrentUser() user: User) {
    return this.tasksService.findAllForUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tasks' })
  create(@CurrentUser() user: User, @Body() dto: CreateTaskDTO) {
    return this.tasksService.create(user.id, dto);
  }

  @Patch('id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    data: Partial<CreateTaskDTO>,
  ) {
    return this.tasksService.update(id, user.id, data);
  }

  @Delete('id')
  @ApiOperation({ summary: 'Delete a task' })
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.delete(id, user.id);
  }
}
