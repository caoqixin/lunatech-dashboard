"use server";

import { loginSchema } from "@/schemas/login-schema";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedData = loginSchema.safeParse(values);

  if (!validatedData.success) {
    return { msg: "登录失败, 登录信息有误", status: "error" };
  }

  const { email, password } = validatedData.data;
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { msg: "登录失败, 登录信息有误", status: "error" };
  }

  return { msg: "登录成功", status: "success", data: user };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (!error) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login");
    }
  }
}
