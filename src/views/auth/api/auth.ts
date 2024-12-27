"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { Login, loginSchema } from "@/views/auth/schema/login.schema";

export async function login(values: Login) {
  const supabase = await createClient();

  const validatedData = loginSchema.safeParse(values);

  if (!validatedData.success) {
    return { msg: "登录失败, 登录信息有误", status: "error" };
  }

  const { error } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return {
      msg: `登录失败, 登录信息有误! 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return { msg: "登录成功", status: "success" };
}

export async function logout() {
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      redirect("/login");
    }
  }
}
