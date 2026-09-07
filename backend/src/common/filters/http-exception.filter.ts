import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let error: string;

    if (typeof exceptionResponse === 'string') {
      error = exceptionResponse;
    } else {
      const responseBody = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };

      error = Array.isArray(responseBody.message)
        ? responseBody.message.join('; ')
        : responseBody.message ?? responseBody.error ?? 'Ошибка запроса';
    }

    response.status(status).json({ error });
  }
}
