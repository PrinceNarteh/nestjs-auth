import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @ApiProperty({ example: 'john.doe@email.com' })
  @IsEmail()
  email: string;
}
