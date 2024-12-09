import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTO/registerUser.dto';
import { LoginDto } from './DTO/loginUser.dto';


@Controller('auth') 
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * @param body - RegisterDto containing name, email, and password.
   */
  @Post('register')
  async registerUser(@Body() dto: RegisterDto) {
    this.logger.log(`Incoming registration request`);
    const response = await this.authService.registerUser(dto);
    this.logger.log(`Registration successful`);
    return response;
  }

  /**
   * Create a new admin.
   * @param body - RegisterDto containing name, email, and password.
   */
  @Post('create-admin')
  async createAdmin(@Body() dto: RegisterDto) {
    this.logger.log(`Incoming admin creation request `);
    const response = await this.authService.registerAdmin(dto);
    this.logger.log(`Admin created successfully`);
    return response;
  }

  /**
   * Log in an existing user.
   * @param body - LoginDto containing email and password.
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    this.logger.log(`Incoming login request`);
    const response = await this.authService.loginAnyUser(dto);
    this.logger.log(`Login successful`);
    return response;
  }
}
