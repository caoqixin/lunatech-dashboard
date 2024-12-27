import { z } from "zod";

export const userImageSchema = z.object({
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateUserNameSchema = z.object({
  name: z.string().min(1, {
    message: "字符必须大于1位",
  }),
});

export const ModifyPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "密码不能小于6位数",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密码输入必须一致",
    path: ["confirmPassword"],
  });

export type ModifyPassword = z.infer<typeof ModifyPasswordSchema>;
export type UserImage = z.infer<typeof userImageSchema>;
export type UpdateUserName = z.infer<typeof updateUserNameSchema>;
