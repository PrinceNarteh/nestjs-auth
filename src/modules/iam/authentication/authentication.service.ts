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
import { ActiveUserData } from 'iam/interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
    } catch (error) {
      throw error;
    }
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(dto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
      });
      const user = await this.usersRepository.findOneByOrFail({ id: sub });
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.accessRefreshTtl),
    ]);
    return { accessToken, refreshToken };
  }
}
