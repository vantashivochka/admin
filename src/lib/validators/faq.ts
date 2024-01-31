import { z } from "zod";

export const FAQValidator = z.object({
  question: z
    .string({
      required_error: "Будь ласка, вкажіть питання.",
    })
    .min(1),
  answer: z
    .string({
      required_error: "Будь ласка, вкажіть відповідь на питання.",
    })
    .min(1),
});

export type FAQSchema = z.infer<typeof FAQValidator>;
