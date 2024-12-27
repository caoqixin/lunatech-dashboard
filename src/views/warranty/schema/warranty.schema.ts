import { z } from "zod";

export const searchWarrantyParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  contact: z.string().optional(),
});

export type SearchWarranty = z.infer<typeof searchWarrantyParamsSchema>;
