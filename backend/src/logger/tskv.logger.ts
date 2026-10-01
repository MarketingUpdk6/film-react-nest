import { Injectable, LoggerService } from '@nestjs/common';
import { serializeLogValue } from './serialize-log-value';

@Injectable()
export class TskvLogger implements LoggerService {
  private escape(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\0/g, '\\0')
      .replace(/=/g, '\\=');
  }

  private stringify(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    return serializeLogValue(value) ?? String(value);
  }

  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    return [
      `level=${this.escape(level)}`,
      `message=${this.escape(this.stringify(message))}`,
      `optionalParams=${this.escape(this.stringify(optionalParams))}`,
    ].join('\t');
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
