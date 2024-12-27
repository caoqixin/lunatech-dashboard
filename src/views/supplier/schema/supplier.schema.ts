import { z } from "zod";

export const SupplierSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  description: z
    .string({
      invalid_type_error: "必须是字符串",
    })
    .optional(),
  site: z
    .string({
      invalid_type_error: "必须是字符串",
    })
    .optional(),
  username: z
    .string({
      invalid_type_error: "必须是字符串",
    })
    .optional(),
  password: z
    .string({
      invalid_type_error: "必须是字符串",
    })
    .optional(),
});

export const SupplierSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

export const supplierSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

export type Supplier = z.infer<typeof SupplierSchema>;
export type SupplierSearchParams = z.infer<typeof SupplierSearchParamsSchema>;
