import { Injectable } from '@nestjs/common';
import { FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';

@Injectable()
export class InMemoryFilmsRepository extends FilmsRepository {
  private readonly films: FilmWithScheduleDto[] = [];

  findAll(): Promise<FilmWithScheduleDto[]> {
    return Promise.resolve(this.films);
  }

  findById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = this.films.find((item) => item.id === id) ?? null;

    return Promise.resolve(film);
  }
  updateTaken(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);

    if (session) {
      session.taken = [...taken];
    }

    return Promise.resolve();
  }
}
