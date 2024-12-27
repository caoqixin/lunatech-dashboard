import { z } from "zod";

export const BrandSchema = z.object({
  name: z.string().trim().min(1, {
    message: "名称不能为空",
  }),
  brand_image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const BrandSearchSchema = z.object({
  key: z.coerce.string().default(""),
});

export type BrandSearch = z.infer<typeof BrandSearchSchema>;
export type Brand = z.infer<typeof BrandSchema>;
