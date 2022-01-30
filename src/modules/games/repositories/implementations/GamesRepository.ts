import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const game = this.repository.createQueryBuilder("game").where('game.title ilike :title', {title: `%${param}%`}).getMany()
    return game
     //.createQueryBuilder("games") é o mesmo que .createQueryBuilder().select("games").from(Game, "games")
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
    SELECT count(*)
    FROM games
    `); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder('games')
        .innerJoinAndSelect('games.users', 'users')
        .where(`games.id = '${id}'`)
        .getOne()

    if(!games) {
      throw new Error('game not found')
    }

    return games.users
      // Complete usando query builder
  }
}
