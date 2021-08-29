import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './interceptor/serialize.interceptor';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body);
    session.userId = user.id;
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: any) {
    const user = await this.authService.login(loginDto);
    session.userId = user.id;
    return user;
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id));
  }

  @Get()
  getAllUsers() {
    return this.usersService.find();
  }
}
