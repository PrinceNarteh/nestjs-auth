import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { HashingService } from 'iam/hashing/hashing.service';
import constants from 'utils/constants';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(dto: SignUpDto) {
    try {
      const hashedPassword = await this.hashingService.hash(dto.password);
      const user = this.usersRepository.create({
        ...dto,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === constants.PG_VIOLATION_ERROR_CODE) {
        throw new ConflictException('Email already in used');
      }
      throw err;
    }
  }

  async signIn(dto: SignInDto) {
    try {
      const user = await this.usersRepository.findOneBy({ email: dto.email });

      if (
        !user ||
        !(await this.hashingService.compare(dto.password, user.password))
      ) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
