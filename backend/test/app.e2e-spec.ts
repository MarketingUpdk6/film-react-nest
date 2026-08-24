import { INestApplication } from '@nestjs/common';
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
});
