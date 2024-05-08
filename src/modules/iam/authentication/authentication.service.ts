import {
  ConflictException,
  Inject,
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
import jwtConfig from 'iam/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
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
      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          issuer: this.jwtConfiguration.issuer,
          audience: this.jwtConfiguration.audience,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTtl,
        },
      );
      return { accessToken };
    } catch (error) {
      throw error;
    }
  }
}
