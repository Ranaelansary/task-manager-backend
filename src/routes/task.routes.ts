import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validate.middleware';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

const router = Router();
const taskController = new TaskController();

// All task routes are protected by authMiddleware
router.use(authMiddleware);

router.post('/', validateDto(CreateTaskDto), (req, res, next) => taskController.createTask(req, res, next));
router.get('/', (req, res, next) => taskController.getTasks(req, res, next));
router.get('/:id', (req, res, next) => taskController.getTaskById(req, res, next));
router.put('/:id', validateDto(UpdateTaskDto), (req, res, next) => taskController.updateTask(req, res, next));
router.delete('/:id', (req, res, next) => taskController.deleteTask(req, res, next));

export default router;
