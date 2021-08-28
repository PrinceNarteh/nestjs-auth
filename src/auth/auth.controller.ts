import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './interceptor/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.create(body);
  }

  @Post('login')
  login() {
    return 'Log in';
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.authService.find(parseInt(id));
  }
}
