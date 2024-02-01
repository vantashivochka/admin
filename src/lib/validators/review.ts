import { z } from "zod";

export const ReviewValidator = z.object({
  name: z.string({ required_error: "Будь ласка, вкажіть ім'я." }).min(1),
  text: z.string({ required_error: "Будь ласка, вкажіть відгук." }),
  rating: z
    .number({ required_error: "Будь ласка, вкажіть рейтинг." })
    .min(1, "Мінімальний рейтинг 1")
    .max(5, "Максимальний рейтинг 5"),
});

export type ReviewSchema = z.infer<typeof ReviewValidator>
