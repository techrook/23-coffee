import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';


/**
 * DTO for updating an existing coffee item
 */
export class UpdateCoffeeDto {
    @IsString({ message: 'Name must be a string' })
    @IsOptional()
    name?: string;
  
    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    description?: string;
  
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be a positive number' })
    @IsOptional()
    price?: number;
  }