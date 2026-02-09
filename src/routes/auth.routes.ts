import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateDto } from '../middlewares/validate.middleware';
import { SignupDto, SigninDto } from '../dtos/auth.dto';

const router = Router();
const authController = new AuthController();

router.post('/signup', validateDto(SignupDto), (req, res, next) => authController.signup(req, res, next));
router.post('/signin', validateDto(SigninDto), (req, res, next) => authController.signin(req, res, next));

export default router;
