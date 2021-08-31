import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

export class UsersService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  create(body: CreateUserDto) {
    const user = this.authRepository.create(body);
    return this.authRepository.save(user);
  }

  async findById(id: number) {
    if (!id) {
      return null;
    }
    const user = await this.authRepository.findOneOrFail(id);
    return user;
  }

  find(filter: { [key: string]: string } = {}) {
    if (Object.keys(filter).length > 0) {
      return this.authRepository.find(filter);
    }
    return this.authRepository.find();
  }

  update(id: number, body: Partial<CreateUserDto>) {}

  async remove(id: number) {
    const user = await this.findById(id);
    await this.authRepository.remove(user);
  }
}
