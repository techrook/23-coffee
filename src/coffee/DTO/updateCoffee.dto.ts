import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';


/**
 * DTO for updating an existing coffee item
 */
export class UpdateCoffeeDto {
    @IsString({ message: 'Name must be a string' })
    name?: string;
  
    @IsString({ message: 'Description must be a string' })
    description?: string;
  
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be a positive number' })
    price?: number;
  }