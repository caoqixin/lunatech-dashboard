"use server";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DataReturnType } from "@/lib/definitions";
import { UpdateUserName } from "../schema/user.schema";

export async function getCurrentUser() {
  noStore();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function updateUserAvatar(
  avatar: string
): Promise<DataReturnType> {
  const supabase = await createClient();

  // 通过 getUser 获取认证用户
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      msg: `无法获取认证用户，失败原因: ${
        userError?.message || "用户信息不存在"
      }`,
      status: "error",
    };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      image: avatar,
    },
  });

  if (error) {
    return {
      msg: `头像更新失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `头像更新成功`,
    status: "success",
  };
}

export async function updateUserName(
  formData: UpdateUserName
): Promise<DataReturnType> {
  const supabase = await createClient();

  // 通过 getUser 获取认证用户
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      msg: `无法获取认证用户，失败原因: ${
        userError?.message || "用户信息不存在"
      }`,
      status: "error",
    };
  }

  const { name } = formData;
  const { error } = await supabase.auth.updateUser({
    data: {
      name,
    },
  });

  if (error) {
    return {
      msg: `用户名更新失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `用户名更新成功`,
    status: "success",
  };
}

export async function updatePassword(
  newPassword: string
): Promise<DataReturnType> {
  const supabase = await createClient();

  // 通过 getUser 获取认证用户
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      msg: `无法获取认证用户，失败原因: ${
        userError?.message || "用户信息不存在"
      }`,
      status: "error",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      msg: `密码更新失败, 失败原因: ${error.message}`,
      status: "error",
    };
  }

  return {
    msg: `密码更新成功`,
    status: "success",
  };
}
