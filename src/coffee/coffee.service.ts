import { Injectable, NotFoundException,Logger, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './DTO/createCoffee.dto';
import { UpdateCoffeeDto } from './DTO/updateCoffee.dto';
@Injectable()
export class CoffeeService {
  private readonly logger = new Logger(CoffeeService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch all coffee items.
   */
  async findAllCoffee() {
    this.logger.log(`fetching all coffee data`);
    return this.prisma.coffee.findMany(); 

  }

  /**
   * Fetch a single coffee item by ID.
   * 
   */
  async findCoffeeById(id: string) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) throw new NotFoundException('Coffee item not found');
    this.logger.log(`fetching a  coffee data by id`);
    return coffee;
  }

  /**
   * Create a new coffee item.
   */
  async createCoffee(createCoffeeDto: CreateCoffeeDto) {
    this.logger.log(`adding new  coffee data`);
    return this.prisma.coffee.create({ data: createCoffeeDto });
  }

  /**
   * Update an existing coffee item.
   * 
   */
  async updateCoffee(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) throw new NotFoundException('Coffee item not found');
    this.logger.log(`updating a  coffee data `);
    return this.prisma.coffee.update({
      where: { id },
      data: updateCoffeeDto,
    });
  }

  /**
   * Delete a coffee item by ID.
   * 
   */
  async deleteCoffee(id: string) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
    if (!coffee) throw new NotFoundException('Coffee item not found');
    this.logger.log(`deleting a  coffee data`);
     this.prisma.coffee.delete({ where: { id } });
     return`Deleted coffee succefully`
  }
}