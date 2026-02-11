import { Request, Response, NextFunction } from 'express';
import { serviceContainer } from '../services/container';
import { SignupDto, SigninDto } from '../dtos/auth.dto';
import { HTTP_STATUS } from '../utils/constants';

export class AuthController {
  private authService = serviceContainer.getAuthService();

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signupDto: SignupDto = req.body;
      const result = await this.authService.signup(signupDto);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signinDto: SigninDto = req.body;
      const result = await this.authService.signin(signinDto);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: 'User signed in successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
