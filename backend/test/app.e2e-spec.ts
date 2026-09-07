import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import request = require('supertest');
import { AppModule } from './../src/app.module';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

describe('Afisha API (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    connection = app.get<Connection>('DATABASE_CONNECTION');
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  it('/api/afisha/films (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('/api/afisha/films/:id/schedule returns 404 for missing film', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films/non-existent-id/schedule')
      .expect(404);

    expect(response.body.error).toBe('Фильм не найден');
    expect(Object.keys(response.body)).toEqual(['error']);
  });
  it('/api/afisha/order rejects invalid seat coordinates', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send({
        email: 'test@test.ru',
        phone: '+70000000000',
        tickets: [
          {
            film: 'film-id',
            session: 'session-id',
            daytime: '2026-08-25T10:00:00.000Z',
            row: '1',
            seat: 2,
            price: 350,
          },
        ],
      })
      .expect(400);

    expect(response.body.error).toContain('tickets.0.row');
    expect(Object.keys(response.body)).toEqual(['error']);
  });
});
