import { FilmWithScheduleDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmWithScheduleDto[]>;

  abstract findById(id: string): Promise<FilmWithScheduleDto | null>;

  abstract reserveSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean>;
}
