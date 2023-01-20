import { z } from "zod";

export const saveUserSchema = z.object({
  loggedInEmail: z.string().email(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  title: z.string().optional(),
  aboutMe: z.string().optional(),
  birthDate: z.date().optional(),
  phoneNumber: z.string().optional(),
  newsOptIn: z.boolean().optional(),
});