import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from 'iam/authentication/decorators/auth.decorator';
import { AuthType } from 'iam/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authenticationService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    return this.authenticationService.signIn(dto);
  }
}
