import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
  create(body: CreateUserDto) {
    return body;
  }

  findUser() {
    return 'Returned User';
  }
}
