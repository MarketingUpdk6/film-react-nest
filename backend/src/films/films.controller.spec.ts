import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    getFilms: jest.fn<FilmsService['getFilms']>(),
    getSchedule: jest.fn<FilmsService['getSchedule']>(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
  });

  describe('getFilms', () => {
    it('вызывает сервис и возвращает список фильмов', async () => {
      const result = {
        total: 1,
        items: [
          {
            id: 'film-id',
            rating: 8,
            director: 'Режиссёр',
            tags: ['драма'],
            title: 'Тестовый фильм',
            about: 'Краткое описание',
            description: 'Описание фильма',
            image: '/image.jpg',
            cover: '/cover.jpg',
          },
        ],
      };

      filmsServiceMock.getFilms.mockResolvedValue(result);

      await expect(controller.getFilms()).resolves.toEqual(result);

      expect(filmsServiceMock.getFilms).toHaveBeenCalledTimes(1);
      expect(filmsServiceMock.getFilms).toHaveBeenCalledWith();
    });

    it('возвращает пустой список, полученный от сервиса', async () => {
      const result = { total: 0, items: [] };

      filmsServiceMock.getFilms.mockResolvedValue(result);

      await expect(controller.getFilms()).resolves.toEqual(result);
    });
  });

  describe('getSchedule', () => {
    it('передаёт идентификатор фильма в сервис и возвращает результат', async () => {
      const filmId = 'film-id';
      const result = { total: 0, items: [] };

      filmsServiceMock.getSchedule.mockResolvedValue(result);

      await expect(controller.getSchedule(filmId)).resolves.toEqual(result);

      expect(filmsServiceMock.getSchedule).toHaveBeenCalledTimes(1);
      expect(filmsServiceMock.getSchedule).toHaveBeenCalledWith(filmId);
    });

    it('передаёт дальше ошибку сервиса для отсутствующего фильма', async () => {
      const error = new NotFoundException('Фильм не найден');

      filmsServiceMock.getSchedule.mockRejectedValue(error);

      await expect(controller.getSchedule('missing-film')).rejects.toBe(error);
    });
  });
});
