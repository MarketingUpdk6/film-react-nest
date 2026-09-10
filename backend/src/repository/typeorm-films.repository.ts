import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';
import { isUUID } from 'class-validator';

@Injectable()
export class TypeOrmFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {
    super();
  }

  async findAll(): Promise<FilmWithScheduleDto[]> {
    const films = await this.filmRepository.find({
      relations: {
        schedule: true,
      },
    });

    return films.map((film) => this.toDto(film));
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    if (!isUUID(id)) {
      return null;
    }

    const film = await this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
    });

    return film ? this.toDto(film) : null;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    return this.scheduleRepository.manager.transaction(async (manager) => {
      const scheduleRepository = manager.getRepository(Schedule);

      const session = await scheduleRepository.findOne({
        where: {
          id: sessionId,
          film: {
            id: filmId,
          },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!session) {
        return false;
      }

      const taken = session.taken ? session.taken.split(',') : [];

      if (places.some((place) => taken.includes(place))) {
        return false;
      }

      session.taken = [...taken, ...places].join(',');
      await scheduleRepository.save(session);

      return true;
    });
  }

  private toDto(film: Film): FilmWithScheduleDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags.split(','),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule.map((session) => ({
        id: session.id,
        daytime: session.daytime,
        hall: session.hall,
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken ? session.taken.split(',') : [],
      })),
    };
  }
}
