import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { type Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to receive access and refresh token' })
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }

  @Public()
  @Get('/verify-email')
  @ApiOperation({ summary: 'Verify email address and auth-login' })
  async verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyEmail(token, res);
  }
}
