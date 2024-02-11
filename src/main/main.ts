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

  await app.listen(port);

  console.log(`Application is running on: localhost:${port} 🚀`);
}
bootstrap();
