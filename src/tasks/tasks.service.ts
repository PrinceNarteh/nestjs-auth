import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, tasks } from 'src/database/schemas';
import { DRIZZLE } from 'src/database/database.module';
import { type DrizzleDB } from 'src/database/types/drizzle';
import { and, eq } from 'drizzle-orm';
import { CreateTaskDTO } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async findAllForUser(userId: string): Promise<Task[]> {
    return this.db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
    });
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });
  }

  async create(userId: string, dto: CreateTaskDTO): Promise<Task> {
    const [task] = await this.db
      .insert(tasks)
      .values({ ...dto, userId })
      .returning();

    return task;
  }

  async update(
    taskId: string,
    userId: string,
    data: Partial<CreateTaskDTO>,
  ): Promise<Task> {
    const task = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }

    const [update] = await this.db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    return update;
  }

  async delete(taskId: string, userId: string) {
    const task = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }

    await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    return { message: 'Task deleted successfully' };
  }
}
