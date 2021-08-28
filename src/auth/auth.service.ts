import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  create() {
    return 'Registered';
  }

  findUser() {
    return 'Returned User';
  }
}
