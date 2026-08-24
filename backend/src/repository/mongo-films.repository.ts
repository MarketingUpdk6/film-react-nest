import { Inject, Injectable } from '@nestjs/common';
import { Connection, HydratedDocument, Model } from 'mongoose';
import { FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';
import { filmSchema } from './schemas/film.schema';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  private readonly filmModel: Model<FilmWithScheduleDto>;

  constructor(
    @Inject('DATABASE_CONNECTION')
    connection: Connection,
  ) {
    super();

    this.filmModel = connection.model<FilmWithScheduleDto>('Film', filmSchema);
  }

  async findAll(): Promise<FilmWithScheduleDto[]> {
    const films = await this.filmModel.find().exec();

    return films.map((film) => this.toDto(film));
  }

  async findById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();

    return film ? this.toDto(film) : null;
  }
  async updateTaken(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $set: {
            'schedule.$.taken': taken,
          },
        },
      )
      .exec();
  }
  private toDto(
    film: HydratedDocument<FilmWithScheduleDto>,
  ): FilmWithScheduleDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: [...film.tags],
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
        taken: [...session.taken],
      })),
    };
  }
}
