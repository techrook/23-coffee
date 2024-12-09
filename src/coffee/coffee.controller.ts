import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './DTO/createCoffee.dto';
import { UpdateCoffeeDto } from './DTO/updateCoffee.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('coffees')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  /**
   * Retrieve all coffee items.
   */
  @Get()
  async findAllCoffee() {
    return this.coffeeService.findAllCoffee();
  }

  /**
   * Retrieve a single coffee item by ID.
   */
  @Get(':id')
  async findCoffeeById(@Param('id') id: string) {
    return this.coffeeService.findCoffeeById(id);
  }

  /**
   * Create a new coffee item (Admin only).
   * Returns HTTP 201 Created on success.
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Require authentication and admin role
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createCoffee(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.createCoffee(createCoffeeDto);
  }

  /**
   * Update an existing coffee item (Admin only).
   * Returns HTTP 200 OK on success.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Require authentication and admin role
  @Roles('admin')
  async updateCoffee(
    @Param('id') id: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeeService.updateCoffee(id, updateCoffeeDto);
  }

  /**
   * Delete a coffee item (Admin only).
   * Returns HTTP 204 No Content on success.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Require authentication and admin role
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCoffee(@Param('id') id: string) {
    await this.coffeeService.deleteCoffee(id);
  }
}
