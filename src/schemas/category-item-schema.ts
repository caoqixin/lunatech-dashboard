import { z } from "zod";

export const CategoryItemSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
});

export type categoryItemValue = z.infer<typeof CategoryItemSchema>;
