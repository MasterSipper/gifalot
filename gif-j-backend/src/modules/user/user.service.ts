import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(user: Pick<User, 'email' | 'password'>) {
    return this.userRepository
      .save(user)
      .then((r) => this.userRepository.create(r));
  }

  public async updateUser(id: number, data: Partial<Omit<User, 'id'>>) {
    return this.userRepository.update(id, data);
  }

  public async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
