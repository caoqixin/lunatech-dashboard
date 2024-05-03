import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
});

export const PhoneSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  code: z.string().optional(),
  isTablet: z.boolean().default(false),
});

export type brandSchamaValue = z.infer<typeof BrandSchema>;
export type phoneSchamaValue = z.infer<typeof PhoneSchema>;
