import { z } from "zod";

export const SupplierSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  description: z.string({
    invalid_type_error: "必须是字符串",
  }),
  site: z.string({
    invalid_type_error: "必须是字符串",
  }),
  username: z.string({
    invalid_type_error: "必须是字符串",
  }),
  password: z.string({
    invalid_type_error: "必须是字符串",
  }),
});
