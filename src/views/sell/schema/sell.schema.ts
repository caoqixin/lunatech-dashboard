import { z } from "zod";

// Schema for search input on the sell page (very simple)
export const sellPageSearchSchema = z.object({
  query: z.string().optional(),
});
export type SellPageSearch = z.infer<typeof sellPageSearchSchema>;
