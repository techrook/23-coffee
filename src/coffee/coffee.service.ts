import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './DTO/createCoffee.dto';
import { UpdateCoffeeDto } from './DTO/updateCoffee.dto';
@Injectable()
export class CoffeeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch all coffee items.
   */
  async findAllCoffee() {
    return this.prisma.coffee.findMany(); // Direct access to the coffee model
  }

  /**
   * Fetch a single coffee item by ID.
   * @throws NotFoundException if the item does not exist.
   */
  async findCoffeeById(id: string) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) throw new NotFoundException('Coffee item not found');
    return coffee;
  }

  /**
   * Create a new coffee item.
   */
  async createCoffee(createCoffeeDto: CreateCoffeeDto) {
    return this.prisma.coffee.create({ data: createCoffeeDto });
  }

  /**
   * Update an existing coffee item.
   * @throws NotFoundException if the item does not exist.
   */
  async updateCoffee(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) throw new NotFoundException('Coffee item not found');

    return this.prisma.coffee.update({
      where: { id },
      data: updateCoffeeDto,
    });
  }

  /**
   * Delete a coffee item by ID.
   * @throws NotFoundException if the item does not exist.
   */
  async deleteCoffee(id: string) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) throw new NotFoundException('Coffee item not found');

    return this.prisma.coffee.delete({ where: { id } });
  }
}