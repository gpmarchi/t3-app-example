import { z } from "zod";
import { SaveUser } from "../../modules/users/services/save-user";
import { saveUserSchema } from "../../modules/users/validations/save-user";

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
  saveProfile: protectedProcedure.input(saveUserSchema).mutation(async ({ input, ctx }) => {
    await SaveUser.execute(input, ctx.prisma)
  })
});
