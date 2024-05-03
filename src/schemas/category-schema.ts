import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
});

export type CategorySchemaValue = z.infer<typeof CategorySchema>;
