import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    createOrder: jest.fn<OrderService['createOrder']>(),
  };

  const order: OrderDto = {
    email: 'test@example.com',
    phone: '+70000000000',
    tickets: [
      {
        film: 'film-id',
        session: 'session-id',
        daytime: '2026-10-01T18:00:00.000Z',
        row: 1,
        seat: 2,
        price: 350,
      },
    ],
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
  });

  describe('createOrder', () => {
    it('передаёт заказ сервису и возвращает оформленные билеты', async () => {
      const result: Awaited<ReturnType<OrderService['createOrder']>> = {
        total: 1,
        items: [
          {
            ...order.tickets[0],
            id: '550e8400-e29b-41d4-a716-446655440000',
          },
        ],
      };

      orderServiceMock.createOrder.mockResolvedValue(result);

      await expect(controller.createOrder(order)).resolves.toEqual(result);

      expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.createOrder).toHaveBeenCalledWith(order);
    });

    it('передаёт дальше ошибку сервиса о занятом месте', async () => {
      const error = new BadRequestException('Место 1:2 уже занято');

      orderServiceMock.createOrder.mockRejectedValue(error);

      await expect(controller.createOrder(order)).rejects.toBe(error);

      expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);
      expect(orderServiceMock.createOrder).toHaveBeenCalledWith(order);
    });
  });
});
