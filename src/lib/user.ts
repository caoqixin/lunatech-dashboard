"use server";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

export async function getUser() {
  noStore();
  const supabse = createClient();

  const {
    data: { user },
    error,
  } = await supabse.auth.getUser();

  return { user, error };
}

export async function auth() {
  const supabse = createClient();

  const {
    data: { user },
  } = await supabse.auth.getUser();

  if (!user) {
    redirect("/login");
  }
}

export async function isLoggedIn() {
  const supabse = createClient();

  const {
    data: { user },
  } = await supabse.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }
}

export async function updateUserName(name: string) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({
    data: { name },
  });

  if (!error) {
    return {
      status: "success",
      msg: `成功更新用户名为 ${user?.user_metadata.name}`,
    };
  }

  return {
    status: "error",
    msg: `用户名更新失败, 请重试`,
  };
}

export async function updateUserPassword(password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (!error) {
    return {
      status: "success",
      msg: `密码更新成功, 请重新登录`,
    };
  }

  return {
    status: "error",
    msg: `密码更新失败, 请重试`,
  };
}
