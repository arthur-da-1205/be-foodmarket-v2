import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSigninDto, UserSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() payload: UserSignupDto) {
    return this.auth.signup(payload);
  }

  @Post('signin')
  signin(@Body() payload: UserSigninDto) {
    return this.auth.signin(payload);
  }
}
