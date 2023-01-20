import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(({ input, ctx }) => {
      const { email } = input

      return ctx.prisma.user.findUnique({
        where: {
          email,
        }
      });
    }),
  saveProfile: protectedProcedure.input(z.object({
    loggedInEmail: z.string().email(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    title: z.string().optional(),
    aboutMe: z.string().optional(),
    birthDate: z.date().optional(),
    phoneNumber: z.string().optional(),
    newsOptIn: z.boolean().optional(),
  })).mutation(async ({ input, ctx }) => {
    const { loggedInEmail, email, name, aboutMe, birthDate, newsOptIn, password, phoneNumber, title } = input;

    const originalUser = await ctx.prisma.user.findUnique({
      where: { email: loggedInEmail },
    });

    if (!originalUser) {
      throw new Error('User not found');
    }

    await ctx.prisma.user.update({
      where: {
        id: originalUser.id,
      },
      data: {
        email: email || originalUser.email,
        password: password || originalUser.password,
        name: name || originalUser.name,
        title: title || originalUser.title,
        aboutMe: aboutMe || originalUser.aboutMe,
        birthDate: birthDate ? new Date(birthDate) : originalUser.birthDate,
        phoneNumber: phoneNumber || originalUser.phoneNumber,
        newsOptIn,
      },
    });
  })
});
