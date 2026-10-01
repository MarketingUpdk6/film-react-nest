import { Injectable, LoggerService } from '@nestjs/common';
import { serializeLogValue } from './serialize-log-value';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    return (
      serializeLogValue({
        level,
        message,
        optionalParams,
      }) ?? ''
    );
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
