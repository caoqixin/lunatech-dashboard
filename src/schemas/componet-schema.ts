import { z } from "zod";
import { PhoneSchema } from "./brand-schema";

export const ComponentSchema = z.object({
  code: z.string().min(1, {
    message: "商品条形码不能为空",
  }),
  name: z.string().min(1, {
    message: "商品名称不能为空",
  }),
  alias: z.string().default(""),
  brand: z.string(),
  model: z.string().array(),
  category: z.string(),
  quality: z.string(),
  supplier: z.string(),
  stock: z.string(),
  purchase_price: z.string(),
  public_price: z.string().default(""),
});
