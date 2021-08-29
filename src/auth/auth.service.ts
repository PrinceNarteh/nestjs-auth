import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const users = await this.usersService.find({ email });
    if (users.length) {
      throw new BadRequestException('Email already in use.');
    }

    // Hashing the user's password
    // 1. Generate a salt
    const salt = randomBytes(8).toString('hex');

    // 2. Hash user's password and the salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //3. Join the hashed password and the salt together
    const hashedPassword = hash.toString('hex') + '.' + salt;
  }

  login() {}
}
