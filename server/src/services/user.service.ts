import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service';
import * as z from 'zod';
import { AccessDeniedException } from 'src/exceptions/access-denied.exception';
import { User } from '@prisma/client';

const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUserCredentials(data: {
    username: string;
    password: string;
  }): Promise<User> {
    const { username, password } = data;
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new AccessDeniedException();
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (false === doesPasswordMatch) {
      throw new AccessDeniedException();
    }

    return user;
  }

  async createUser(data: z.input<typeof createUserSchema>) {
    const parsed = createUserSchema.parse(data);

    const hashedPassword = await bcrypt.hash(parsed.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...parsed,
        password: hashedPassword,
      },
    });

    return user;
  }
}
