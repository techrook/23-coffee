import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTO/registerUser.dto';
import { LoginDto } from './DTO/loginUser.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('auth') // Base route for authentication
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.JWT_SECRET
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
   * Create a new admin (restricted to superadmins).
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
    const response = await this.authService.loginUser(dto);
    this.logger.log(`Login successful`);
    return response;
  }
}
