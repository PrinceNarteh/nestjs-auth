import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const users = await this.usersService.find({ email });
    if (users.length) {
      throw new BadRequestException('Email already in use.');
    }
  }

  login() {}
}
