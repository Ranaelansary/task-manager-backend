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

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });

    await this.taskRepository.save(task);

    return this.mapTaskToResponse(task);
  }

  async getTasksByUserId(userId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return tasks.map((task) => this.mapTaskToResponse(task));
  }

  async getTaskById(taskId: string, userId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    return this.mapTaskToResponse(task);
  }

  async updateTask(taskId: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    Object.assign(task, updateTaskDto);
    await this.taskRepository.save(task);

    return this.mapTaskToResponse(task);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
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
      isCompleted: task.isCompleted,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
