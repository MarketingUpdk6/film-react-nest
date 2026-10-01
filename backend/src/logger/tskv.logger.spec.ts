import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('формирует поля, разделённые табуляцией', () => {
      const result = logger.formatMessage('log', 'Сервер запущен', 'Bootstrap');

      expect(result.split('\t')).toEqual([
        'level=log',
        'message=Сервер запущен',
        'optionalParams=["Bootstrap"]',
      ]);
    });

    it('сохраняет объект сообщения как строку JSON', () => {
      const result = logger.formatMessage('error', {
        code: 500,
        description: 'Ошибка сервера',
      });

      expect(result.split('\t')).toEqual([
        'level=error',
        'message={"code":500,"description":"Ошибка сервера"}',
        'optionalParams=[]',
      ]);
    });

    it('сохраняет несколько дополнительных параметров в одном поле', () => {
      const result = logger.formatMessage(
        'error',
        'Ошибка',
        'стек ошибки',
        'OrderService',
      );

      expect(result.split('\t')[2]).toBe(
        'optionalParams=["стек ошибки","OrderService"]',
      );
    });

    it('возвращает пустой массив при отсутствии дополнительных параметров', () => {
      const result = logger.formatMessage('warn', 'Нет данных');

      expect(result.split('\t')[2]).toBe('optionalParams=[]');
    });

    it('экранирует специальные символы внутри сообщения', () => {
      const message = 'Путь\\файл\tстрока\nвозврат\rноль\0ключ=значение';
      const result = logger.formatMessage('log', message);

      expect(result.split('\t')).toEqual([
        'level=log',
        'message=Путь\\\\файл\\tстрока\\nвозврат\\rноль\\0ключ\\=значение',
        'optionalParams=[]',
      ]);

      expect(result).not.toContain('\n');
      expect(result).not.toContain('\r');
      expect(result).not.toContain('\0');
    });

    it('преобразует число и null в строковые значения', () => {
      expect(logger.formatMessage('log', 42).split('\t')[1]).toBe('message=42');

      expect(logger.formatMessage('log', null).split('\t')[1]).toBe(
        'message=null',
      );
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
      '%s выводит TSKV через console.%s',
      (level, consoleMethod) => {
        const consoleSpy = jest
          .spyOn(console, consoleMethod)
          .mockImplementation(() => {});

        logger[level]('Тестовое сообщение', 'TestContext');

        const expected = [
          `level=${level}`,
          'message=Тестовое сообщение',
          'optionalParams=["TestContext"]',
        ].join('\t');

        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(expected);
      },
    );
    it('сохраняет имя, сообщение и стек ошибки', () => {
      const error = new Error('Ошибка подключения к базе');
      const result = logger.formatMessage('error', error);

      const messageField = result.split('\t')[1];

      expect(messageField).toContain('"name":"Error"');
      expect(messageField).toContain('"message":"Ошибка подключения к базе"');
      expect(messageField).toContain('"stack":');
      expect(result).not.toContain('\n');
      expect(result.split('\t')).toHaveLength(3);
    });
  });
});
