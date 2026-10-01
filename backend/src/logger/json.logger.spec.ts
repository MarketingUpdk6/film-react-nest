import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('формирует JSON с уровнем, сообщением и дополнительными параметрами', () => {
      const result = logger.formatMessage('log', 'Сервер запущен', 'Bootstrap');

      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'Сервер запущен',
        optionalParams: ['Bootstrap'],
      });
    });

    it('сохраняет объект сообщения и несколько дополнительных параметров', () => {
      const result = logger.formatMessage(
        'error',
        { code: 500, description: 'Ошибка сервера' },
        'стек ошибки',
        'OrderService',
      );

      expect(JSON.parse(result)).toEqual({
        level: 'error',
        message: {
          code: 500,
          description: 'Ошибка сервера',
        },
        optionalParams: ['стек ошибки', 'OrderService'],
      });
    });

    it('возвращает пустой массив при отсутствии дополнительных параметров', () => {
      const result = logger.formatMessage('warn', 'Нет данных');

      expect(JSON.parse(result)).toEqual({
        level: 'warn',
        message: 'Нет данных',
        optionalParams: [],
      });
    });

    it('экранирует перенос строки, табуляцию и кавычки внутри сообщения', () => {
      const message = 'Первая строка\nВторая\t"цитата"';
      const result = logger.formatMessage('log', message);

      expect(result).not.toContain('\n');
      expect(result).not.toContain('\t');
      expect(JSON.parse(result).message).toBe(message);
    });
    it('сохраняет имя, сообщение и стек ошибки', () => {
      const error = new Error('Ошибка подключения к базе');

      const result = logger.formatMessage('error', error);

      expect(JSON.parse(result)).toEqual({
        level: 'error',
        message: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        optionalParams: [],
      });
    });
  });
  describe('вывод в консоль', () => {
    type LoggerMethod = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
    type ConsoleMethod = 'log' | 'error' | 'warn' | 'debug';

    const cases: [LoggerMethod, ConsoleMethod][] = [
      ['log', 'log'],
      ['error', 'error'],
      ['warn', 'warn'],
      ['debug', 'debug'],
      ['verbose', 'log'],
    ];

    it.each(cases)(
      '%s выводит JSON через console.%s',
      (level, consoleMethod) => {
        const consoleSpy = jest
          .spyOn(console, consoleMethod)
          .mockImplementation(() => {});

        logger[level]('Тестовое сообщение', 'TestContext');

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(
          JSON.stringify({
            level,
            message: 'Тестовое сообщение',
            optionalParams: ['TestContext'],
          }),
        );
      },
    );
  });
});
