import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './DTO/registerUser.dto';
import { LoginDto } from './DTO/loginUser.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user in the database.
   * @param dto - User's name,email,password and role.
   * @returns Success message and user ID.
   */
  async registerUser(dto: RegisterDto) {
    this.logger.log(`Attempting to register user`);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      this.logger.error(
        `Registration failed: User with email ${dto.email} already exists`,
      );
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const { password, ...restDto } = dto;

    const user = await this.prisma.user.create({
      data: {
        ...restDto,
        password: hashedPassword,
      },
    });

    const { password: _, ...User } = user;

    this.logger.log(`User registered successfully`);
    return { message: `User registered successfully`, data: User };
  }

  /**
   * Create an admin user.
   * @param dto - Registration details for the admin.
   * @returns Success message and admin data.
   */
  async registerAdmin(dto: RegisterDto) {
    this.logger.log(`Attempting to register admin`);

    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingAdmin) {
      this.logger.error(
        `Admin registration failed, email already exists`,
      );
      throw new BadRequestException('email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const { password: _, ...safeAdmin } = admin;

    this.logger.log(`Admin registered successfully`);
    return { message: `Admin registered successfully`, data: safeAdmin };
  }

  /**
   * Log in an existing user by validating credentials.
   * @param email - User's email address.
   * @param password - User's plain-text password.
   * @returns A JWT token if authentication is successful.
   */
  async loginAnyUser(dto: LoginDto) {
    this.logger.log(`Attempting to login`);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.error(`Login failed: User with email ${dto.email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(
        `Login failed: Invalid password for user with email: ${dto.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    this.logger.log(`User logged in successfully with email: ${dto.email}`);

    return { message: 'Login successful', access_token: token };
  }
}
