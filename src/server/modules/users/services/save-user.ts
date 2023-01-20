import type { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';

interface SaveUserInput {
  loggedInEmail: string;
  email?: string;
  password?: string;
  name?: string;
  title?: string;
  aboutMe?: string;
  birthDate?: Date;
  phoneNumber?: string;
  newsOptIn?: boolean;
}

type SaveUserResponse = void;

export class SaveUser {
  static async execute(
    input: SaveUserInput,
    prisma: PrismaClient,
  ): Promise<SaveUserResponse> {
    const {
      loggedInEmail,
      email,
      password,
      name,
      title,
      aboutMe,
      birthDate,
      phoneNumber,
      newsOptIn,
    } = input;

    const originalUser = await prisma.user.findUnique({
      where: { email: loggedInEmail },
    });

    if (!originalUser) {
      throw new TRPCError({code: 'NOT_FOUND', message: 'User not found'});
    }

    if (email && email !== originalUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new TRPCError({code: 'CONFLICT', message: 'Email already in use'});
      }
    }

    await prisma.user.update({
      where: {
        id: originalUser.id,
      },
      data: {
        email: email || originalUser.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        password: password ? await hash(password, 8) : originalUser.password,
        name: name || originalUser.name,
        title: title || originalUser.title,
        aboutMe: aboutMe || originalUser.aboutMe,
        birthDate: birthDate ? new Date(birthDate) : originalUser.birthDate,
        phoneNumber: phoneNumber || originalUser.phoneNumber,
        newsOptIn,
      },
    });
  }
}
