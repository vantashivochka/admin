import { z } from "zod";

export const LoginValidator = z.object({
  username: z
    .string({
      required_error: "Будь-ласка, вкажіть логін.",
    })
    .min(1),
  password: z
    .string({
      required_error: "Будь-ласка, вкажіть пароль.",
    })
    .min(1),
});

export type LoginSchema = z.infer<typeof LoginValidator>;
