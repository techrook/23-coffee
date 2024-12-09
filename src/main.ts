import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/global-exceptions.filters';

import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  // Validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException({
          statusCode: 422,
          message: 'Validation Error',
          errors: errors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          })),
        });
      },
    }),    
  );


  app.useGlobalFilters(new GlobalExceptionFilter());


  app.setGlobalPrefix('/v1/api');    


  app.enableCors();

  

  const port = process.env.PORT || 3000; 

  try {
    await app.listen(port);
    console.log(`Application is running on port: ${port}`);
  } catch (err) {
    console.error(`Error during startup: ${err.message}`);
    process.exit(1);
  }
}

bootstrap();