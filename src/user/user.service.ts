import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserUpdateDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async updateProfile(id: any, payload: UserUpdateDto) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!user) throw new Error('No User found');

    const updatedData = await this.prismaService.user.update({
      where: { id },
      data: payload,
    });

    return { status: 'Ok', message: 'Updated successfully', user: updatedData };
  }
}
