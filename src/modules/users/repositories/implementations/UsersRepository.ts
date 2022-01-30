import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    // Complete usando ORM
    const user = await this.repository.findOne({
      relations: ["games"],
      where: {id: user_id}
    })
    if(!user) {
      throw new Error("user not found")
    }
    return user
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      `SELECT * 
      FROM users
      ORDER BY first_name asc
      `
      ); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
    SELECT *
    FROM users
    WHERE LOWER (first_name) = '${first_name.toLowerCase()}' AND LOWER (last_name) = '${last_name.toLowerCase()}'
    `); // Complete usando raw query
        // WHERE LOWER (first_name) = LOWER ('${first_name}') AND LOWER (last_name) = LOWER ('${last_name}')
  }
}
