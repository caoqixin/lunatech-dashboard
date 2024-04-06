import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, {
    message: "用户名不能为空",
  }),
});

export const ModifyPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "密码不能小于6位数",
    }),
    confirmation_password: z.string(),
  })
  .refine((data) => data.password === data.confirmation_password, {
    message: "密码输入必须一致",
    path: ["confirmation_password"],
  });

export type UserSchemaValue = z.infer<typeof UserSchema>;
export type ModifyPasswordSchemaValue = z.infer<typeof ModifyPasswordSchema>;
