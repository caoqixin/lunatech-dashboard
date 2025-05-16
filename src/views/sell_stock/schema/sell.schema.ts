import { z } from "zod";

export const sellSearchSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  id: z.string().optional(),
  name: z.string().optional(),
  category: z.string().optional(),
});

export type SellStockSearch = z.infer<typeof sellSearchSchema>;

export const SellStockData = z.object({
  id: z.string().min(1, "商品ID不能为空").max(50, "商品ID过长 (最多50字符)"),
  name: z
    .string()
    .min(1, "商品名称不能为空")
    .max(100, "名称过长 (最多100字符)"),
  category: z.string().min(1, {
    message: "请选择商品分类",
  }),
  supplier_name: z.string().min(1, {
    message: "请选择供应商",
  }),
  quantity: z.coerce
    .number({ invalid_type_error: "数量必须是数字" })
    .int({ message: "数量必须是整数" })
    .nonnegative({ message: "数量不能为负" }),
  purchase_price: z.coerce
    .number({ invalid_type_error: "进价必须是数字" })
    .nonnegative({ message: "进价不能为负数" })
    .optional(),
  selling_price: z.coerce
    .number({ invalid_type_error: "售价必须是数字" })
    .nonnegative({ message: "售价不能为负数" }),
  image_url: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type SellStockForm = z.infer<typeof SellStockData>;
