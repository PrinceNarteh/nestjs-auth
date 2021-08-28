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

  findOne(id: number) {
    const user = this.authRepository.findOneOrFail(id);
    return user;
  }

  find() {
    const users = this.authRepository.find();
    return users;
  }

  update(id: number, body: Partial<CreateUserDto>) {}
  remove(id: number) {}
}
