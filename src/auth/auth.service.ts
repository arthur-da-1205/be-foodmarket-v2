import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSigninDto, UserSignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(payload: UserSignupDto) {
    const requiredFields = [
      'email',
      'firstName',
      'lastName',
      'phoneNumber',
      'password',
    ];
    const emptyField = requiredFields.find((field) => !payload[field]);

    if (emptyField) {
      throw new ForbiddenException(`Field '${emptyField}' cannot be empty`);
    }

    const hash = await argon.hash(payload.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phoneNumber: payload.phoneNumber,
          hash,
          role: 'USER',
          address: payload.address,
          city: payload.city,
          houseNumber: payload.houseNumber,
          picturePath: payload.picturePath,
        },
      });

      return this.createToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials has been taken');
        }

        throw new Error('Something went wrong');
      }
    }
  }

  async signin(payload: UserSigninDto) {
    if (!payload.email || !payload.password)
      throw new ForbiddenException(`Fields cannot be empty`);

    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!user) throw new ForbiddenException('Crecentials incorrect');

    const passMatch = await argon.verify(user.hash, payload.password);

    if (!passMatch) throw new ForbiddenException('Credentials incorrect');

    return this.createToken(user.id, user.email);
  }

  async createToken(
    userId: number,
    email: string,
  ): Promise<{ message: string; access_token: string }> {
    const payload = { sub: userId, email };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });

    return { message: 'success', access_token: token };
  }
}
