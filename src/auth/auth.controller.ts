import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
