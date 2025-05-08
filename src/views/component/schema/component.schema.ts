import { z } from "zod";

export const componentSchema = z.object({
  code: z.string().min(1, {
    message: "商品条形码不能为空",
  }),
  name: z.string().min(1, {
    message: "商品名称不能为空",
  }),
  alias: z.string().optional(),
  brand: z.string(),
  model: z.string().array().optional(),
  category: z.string(),
  quality: z.string(),
  supplier: z.string(),
  stock: z.coerce
    .number()
    .nonnegative({
      message: "库存必须为非负整数",
    })
    .int({
      message: "库存必须是整数",
    }),
  purchase_price: z.coerce.number().nonnegative({
    message: "采购价格必须为非负数",
  }),
  public_price: z.coerce
    .number()
    .nonnegative({
      message: "维修报价必须为非负数",
    })
    .optional(),
});

export const searchComponentParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  name: z.string().default(""),
  category: z.string().default(""),
  brand: z.string().default(""),
});

export type SearchComponent = z.infer<typeof searchComponentParamsSchema>;
export type ComponentSchema = z.infer<typeof componentSchema>;

export enum Qualities {
  COMPATIBILE = "compatibile",
  ORIGINALE = "originale",
  HARDOLED = "hard oled compatibile",
  SOFTOLED = "soft oled compatibile",
  INCELL = "incell",
  SERVICE = "service package original",
  RIGENERATO = "rigenerato",
}
