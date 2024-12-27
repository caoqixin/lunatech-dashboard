import { z } from "zod";

export const orderSearchParams = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  tab: z.string().default("order"),
});

export type OrderSearch = z.infer<typeof orderSearchParams>;
