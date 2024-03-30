"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route/routes";
import { loginSchema } from "@/schemas/login-schema";
import { AuthError } from "next-auth";
import { z } from "zod";

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedData = loginSchema.safeParse(values);

  if (!validatedData.success) {
    return { msg: "登录失败, 登录信息有误", status: "error" };
  }

  const { email, password } = validatedData.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { msg: "登录成功", status: "success" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { msg: "登录失败, 登录信息有误", status: "error" };

        default:
          return { msg: "登陆失败", status: "error" };
      }
    }
    throw error;
  }
}
