import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Task } from '../entities/Task';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dtos/task.dto';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

export class TaskService {
  private taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = AppDataSource.getRepository(Task);
  }

  async createTask(userId: number, createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });

    await this.taskRepository.save(task);

    return this.mapTaskToResponse(task);
  }

  async getTasksByUserId(userId: number): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return tasks.map((task) => this.mapTaskToResponse(task));
  }

  async getTaskById(taskId: number, userId: number): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    return this.mapTaskToResponse(task);
  }

  async updateTask(taskId: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    // Handle both 'completed' and 'isCompleted' for compatibility
    const updateData = { ...updateTaskDto };
    if ('completed' in updateData && !('isCompleted' in updateData)) {
      (updateData as any).isCompleted = (updateData as any).completed;
      delete (updateData as any).completed;
    }

    Object.assign(task, updateData);
    await this.taskRepository.save(task);

    return this.mapTaskToResponse(task);
  }

  async deleteTask(taskId: number, userId: number): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    await this.taskRepository.remove(task);
  }

  private mapTaskToResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.isCompleted,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
