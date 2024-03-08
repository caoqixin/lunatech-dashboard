import { z } from "zod";

export const RepairSchema = z.object({
  phone: z.string(),
});

export type RepairFormValue = z.infer<typeof RepairSchema>;
