import { LoggerService, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const loggerFormat = configService.get<string>('LOG_FORMAT', 'dev');

  let logger: LoggerService;

  switch (loggerFormat) {
    case 'dev':
      logger = app.get(DevLogger);
      break;
    case 'json':
      logger = app.get(JsonLogger);
      break;
    case 'tskv':
      logger = app.get(TskvLogger);
      break;
    default:
      throw new Error(`Неизвестный формат логов: ${loggerFormat}`);
  }

  app.useLogger(logger);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.getOrThrow<string>('PORT');

  await app.listen(port);
}
bootstrap();
