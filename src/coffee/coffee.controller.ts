import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
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
    async findAll() {
      return this.coffeeService.findAllCoffee();
    }
  
    /**
     * Retrieve a single coffee item by ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
      console.log(id)
      return this.coffeeService.findCoffeeById(id);
    }
  
    /**
     * Create a new coffee item (Admin only).
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard) // Require authentication and admin role
    @Roles('admin')
    async create(@Body() createCoffeeDto: CreateCoffeeDto) {
      return this.coffeeService.createCoffee(createCoffeeDto);
    }
  
    /**
     * Update an existing coffee item (Admin only).
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard) // Require authentication and admin role
    @Roles('admin')
    async update(
      @Param('id') id: string,
      @Body() updateCoffeeDto: UpdateCoffeeDto,
    ) {
      return this.coffeeService.updateCoffee(id, updateCoffeeDto);
    }
  
    /**
     * Delete a coffee item (Admin only).
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard) // Require authentication and admin role
    @Roles('admin')
    async delete(@Param('id') id: string) {
      return this.coffeeService.deleteCoffee(id);
    }
  }
  