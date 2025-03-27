"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResult, MFAEnrollmentDetails } from "../components/types";
import { AuthError } from "@supabase/supabase-js";

// 注册 MFA
export async function enrollMFA(): Promise<ActionResult<MFAEnrollmentDetails>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "luna_tech_mfa",
    });

    if (error) throw error;

    return {
      success: true,
      data: {
        id: data.id,
        qr_code: data.totp.qr_code,
        secret: data.totp.secret,
      },
    };
  } catch (err) {
    console.error("MFA Enrollment Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "注册失败",
    };
  }
}

// 验证 MFA
export async function verifyMFA({
  factorId,
  code,
}: {
  factorId: string;
  code: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    // 第一步：创建挑战
    const challengeResult = await supabase.auth.mfa.challenge({ factorId });
    if (challengeResult.error) throw challengeResult.error;

    const challengeId = challengeResult.data.id;

    // 第二步：验证挑战
    const verifyResult = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    });

    if (verifyResult.error) throw verifyResult.error;

    return { success: true };
  } catch (err) {
    console.error("MFA Verification Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "验证失败",
    };
  }
}

// 取消注册 MFA
export async function unenrollMFA({
  factorId,
}: {
  factorId: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("MFA Unenrollment Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "取消注册失败",
    };
  }
}

// 列出 MFA 因子
export async function listMFAFactors(): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.mfa.listFactors();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("List MFA Factors Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "获取因子列表失败",
    };
  }
}

// 查看是否已开启MFA
export async function isMFAActivated(): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) throw error;

    if (data.nextLevel === "aal2" && data.nextLevel === data.currentLevel) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError ? error.message : "验证失败",
    };
  }
}

export async function isNeedVerify(): Promise<ActionResult> {
  const supabase = await createClient();

  try {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (error) throw error;

    if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError ? error.message : "验证失败",
    };
  }
}
