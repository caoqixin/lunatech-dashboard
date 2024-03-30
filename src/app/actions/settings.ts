"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SettingReturnValue {
  msg: string;
  status: string;
}

export async function setting(
  name: string,
  preState: SettingReturnValue,
  data: FormData
) {
  const setting_value = data.get(name) as string;

  try {
    await prisma.setting.upsert({
      create: {
        setting_name: name,
        setting_value: setting_value,
      },
      where: {
        setting_name: name,
      },
      update: {
        setting_value: setting_value,
      },
    });
    revalidatePath("/dashboard/settings");
    return {
      msg: `${name} 成功更新为${setting_value}`,
      status: "success",
    };
  } catch (error) {
    return {
      msg: `${name} 更新失败`,
      status: "error",
    };
  }
}
