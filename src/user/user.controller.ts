import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/decorator/get-user.decorator';
import { UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('profile')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(
    @GetUser('id') id: string,
    @GetUser('email') email: string,
    @GetUser('phoneNumber') phone: string,
    @GetUser('firstName') firstName: string,
    @GetUser('lastName') lastName: string,
    @GetUser('address') address: string,
    @GetUser('houseNumber') houseNumber: string,
    @GetUser('city') city: string,
    @GetUser('picturePath') picturePath: string,
  ) {
    return {
      user: {
        id,
        email,
        phone: phone,
        fullName: `${firstName} ${lastName}`,
        address: `${address}, ${houseNumber}, ${city}`,
        image: picturePath,
      },
    };
  }

  @Patch('update')
  updateProfile(@GetUser('id') id: any, @Body() payload: UserUpdateDto) {
    return this.userService.updateProfile(id, payload);
  }
}
