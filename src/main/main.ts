import { EnvService } from '@/infra/env/env.service';
import { DefaultExceptionFilter } from '@/infra/http/filters/default-exception-filter.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DefaultExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: 0.0.0.0:${port} 🚀`);
}
bootstrap();
