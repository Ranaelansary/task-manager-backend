import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/container';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import { HTTP_STATUS } from '../utils/constants';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export class TaskController {
  private taskService = serviceContainer.getTaskService();

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId!);
      const createTaskDto: CreateTaskDto = req.body;
      const result = await this.taskService.createTask(userId, createTaskDto);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: result,
        message: 'Task created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId!);
      const tasks = await this.taskService.getTasksByUserId(userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: tasks,
        message: 'Tasks retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId!);
      const { id } = req.params;
      const task = await this.taskService.getTaskById(Number(id), userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: task,
        message: 'Task retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId!);
      const { id } = req.params;
      const updateTaskDto: UpdateTaskDto = req.body;
      const result = await this.taskService.updateTask(Number(id), userId, updateTaskDto);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: 'Task updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId!);
      const { id } = req.params;
      await this.taskService.deleteTask(Number(id), userId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: null,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
