import { z } from "zod";

export const CustomerSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空",
  }),
  tel: z.string().min(1, {
    message: "电话号码不能为空",
  }),
  email: z.string().optional(),
});
