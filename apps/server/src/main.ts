import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Note apis documentation')
    .setDescription('This is the documentation for notes api.')
    .setVersion('1.0')
    .addTag('Notes')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      content: document,
      layout: 'modern',
      metaData: {
        title: 'Notes API Reference',
        description: 'Beautiful API docs using Scalar',
      },
      theme: 'deepSpace',
      showToolbar: 'localhost',
    }),
  );

  await app.listen(process.env.PORT as string);

  logger.log(`Server is running on http://localhost:${process.env.PORT}`);
  logger.log(`📘 Docs available at http://localhost:${process.env.PORT}/docs`);
}
bootstrap();
