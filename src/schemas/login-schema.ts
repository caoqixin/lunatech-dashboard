import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "请输入正确的邮箱",
  }),
  password: z.string().min(1, {
    message: "密码不能为空",
  }),
});
