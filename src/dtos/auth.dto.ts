import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters' })
  fullName!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  password!: string;
}

export class AuthResponseDto {
  id!: number;
  email!: string;
  fullName!: string;
  token!: string;
}
