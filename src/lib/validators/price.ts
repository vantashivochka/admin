import { z } from "zod";

export const PriceValidator = z.object({
  title: z.string().min(1, "Назва обов'язкова."),
  price: z.number().min(1, "Ціна обов'язкова"),
  description: z.string().optional(),
});

export type PriceSchema = z.infer<typeof PriceValidator>;
