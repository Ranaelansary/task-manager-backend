import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { SignupDto, SigninDto, AuthResponseDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';
import type { SignOptions } from 'jsonwebtoken';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = this.userRepository.create({
      email: signupDto.email,
      fullName: signupDto.fullName,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      token,
    };
  }

  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: signinDto.email },
    });

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = this.generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    const secret: string = process.env.JWT_SECRET || 'your_secret_key';
    const expiresIn = process.env.JWT_EXPIRATION || '7d';
    
    const token = jwt.sign(
      { userId, email },
      secret,
      { expiresIn } as any
    );
    return token;
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    try {
      const secret: string = process.env.JWT_SECRET || 'your_secret_key';
      const decoded = jwt.verify(token, secret) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
