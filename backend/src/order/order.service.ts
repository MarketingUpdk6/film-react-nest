import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { randomUUID } from 'node:crypto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async createOrder(order: OrderDto) {
    const updates = new Map<
      string,
      {
        filmId: string;
        sessionId: string;
        rows: number;
        seats: number;
        taken: Set<string>;
        places: Set<string>;
      }
    >();

    for (const ticket of order.tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      let update = updates.get(key);

      if (!update) {
        const film = await this.filmsRepository.findById(ticket.film);

        if (!film) {
          throw new BadRequestException('Фильм не найден');
        }

        const session = film.schedule.find(
          (item) => item.id === ticket.session,
        );

        if (!session) {
          throw new BadRequestException('Сеанс не найден');
        }

        update = {
          filmId: ticket.film,
          sessionId: ticket.session,
          rows: session.rows,
          seats: session.seats,
          taken: new Set(session.taken),
          places: new Set<string>(),
        };

        updates.set(key, update);
      }

      if (
        ticket.row < 1 ||
        ticket.row > update.rows ||
        ticket.seat < 1 ||
        ticket.seat > update.seats
      ) {
        throw new BadRequestException('Указано несуществующее место');
      }

      const place = `${ticket.row}:${ticket.seat}`;

      if (update.taken.has(place)) {
        throw new BadRequestException(`Место ${place} уже занято`);
      }

      update.taken.add(place);
      update.places.add(place);
    }

    for (const update of updates.values()) {
      const reserved = await this.filmsRepository.reserveSeats(
        update.filmId,
        update.sessionId,
        [...update.places],
      );

      if (!reserved) {
        const film = await this.filmsRepository.findById(update.filmId);
        const session = film?.schedule.find(
          (item) => item.id === update.sessionId,
        );
        const occupiedPlace = [...update.places].find((place) =>
          session?.taken.includes(place),
        );

        throw new BadRequestException(
          occupiedPlace
            ? `Место ${occupiedPlace} уже занято`
            : 'Не удалось забронировать места',
        );
      }
    }

    const items = order.tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }
}
