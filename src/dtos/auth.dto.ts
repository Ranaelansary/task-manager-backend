import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters' })
  fullName!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}

export class SigninDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  password!: string;
}

export class AuthResponseDto {
  id!: string;
  email!: string;
  fullName!: string;
  token!: string;
}
