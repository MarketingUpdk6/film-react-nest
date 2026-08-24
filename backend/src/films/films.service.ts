import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms() {
    const films = await this.filmsRepository.findAll();

    const items = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(id: string) {
    const film = await this.filmsRepository.findById(id);
    const items = film?.schedule ?? [];

    return {
      total: items.length,
      items,
    };
  }
}
