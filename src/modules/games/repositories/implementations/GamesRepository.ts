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
    const result = await this.repository
      .createQueryBuilder("games")
      .where(`title ILIKE :title`, { title: `%${param}%` })
      .getMany();

    return result;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
     `SELECT COUNT(id) as count
      FROM games`
    );
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    console.log({ id })

    const sql = this.repository
      .createQueryBuilder("g")
      .select("u.*")
      .innerJoin(
        "users_games_games",
        "ug",
        "g.id = ug.gamesId"
      )
      .innerJoin(
        "users",
        "u",
        "ug.usersId = u.id"
      )
      .where(`g.id = :id`, { id })
      .getSql();

    console.log({ sql });

    const result = await this.repository
      .createQueryBuilder("g")
      .select("u.*")
      .innerJoin(
        "users_games_games",
        "ug",
        "g.id = ug.gamesId"
      )
      .innerJoin(
        "users",
        "u",
        "ug.usersId = u.id"
      )
      .where(`g.id = :id`, { id })
      .getMany();
    
    console.log({ result })
        
    return result as any;
  }
}
