import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO for user login
 */
export class LoginDto {
    @IsEmail({}, { message: 'Email must be valid' })
    email: string;
  
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }