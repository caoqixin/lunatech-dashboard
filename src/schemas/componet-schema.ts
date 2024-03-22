import { z } from "zod";

export const ComponentSchema = z.object({
  code: z
    .string()
    .min(1, {
      message: "商品条形码不能为空",
    })
    .optional(),
  name: z.string().min(1, {
    message: "商品名称不能为空",
  }),
  alias: z.string().optional(),
  brand: z.string(),
  model: z.string().array(),
  category: z.string(),
  quality: z.string(),
  supplier: z.string(),
  stock: z.string(),
  purchase_price: z.string(),
  public_price: z.string().optional(),
});
