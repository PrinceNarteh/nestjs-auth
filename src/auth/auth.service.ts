import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  create(body: CreateUserDto) {
    const user = this.authRepository.create(body);
    return this.authRepository.save(user);
  }

  find(id: number) {
    const user = this.authRepository.findOneOrFail(id);
    return user;
  }
}
