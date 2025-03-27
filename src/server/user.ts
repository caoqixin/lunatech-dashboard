"use server";

import { createClient } from "@/lib/supabase/server";
import { isMFAActivated, listMFAFactors } from "@/views/setting/api/auth";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function isLoggedIn() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // 判断是否开启mfa
    const factors = await listMFAFactors();
    const factorTotp = factors.data.totp[0];

    if (factorTotp) {
      const mfa = await isMFAActivated();
      if (mfa.success) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  return false;
}
