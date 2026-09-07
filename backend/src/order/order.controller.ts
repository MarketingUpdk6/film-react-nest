import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  createOrder(@Body() order: OrderDto) {
    return this.orderService.createOrder(order);
  }
}
