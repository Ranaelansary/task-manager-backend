import { AuthService } from './auth.service';
import { TaskService } from './task.service';

class ServiceContainer {
  private authService: AuthService | null = null;
  private taskService: TaskService | null = null;

  getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
    }
    return this.authService;
  }

  getTaskService(): TaskService {
    if (!this.taskService) {
      this.taskService = new TaskService();
    }
    return this.taskService;
  }
}

export const serviceContainer = new ServiceContainer();
