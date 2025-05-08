import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  enrollMFA,
  verifyMFA,
  unenrollMFA,
  listMFAFactors,
  isMFAActivated,
} from "@/views/setting/api/auth";
import type { MFAEnrollmentDetails } from "./types";
import { AuthError, Factor } from "@supabase/supabase-js";
import { Loader } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/custom/copy-button";
import { cn } from "@/lib/utils";

const SecuritySetting: React.FC = () => {
  // 状态管理
  // MFA 是否开启
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  // 注册MFA dialog
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  // 注册MFA 时的Data
  const [mfaEnrollmentDetails, setMfaEnrollmentDetails] =
    useState<MFAEnrollmentDetails | null>(null);
  // 验证码
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch initial MFA status using listMFAFactors
  const loadMFAStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    // console.log("Loading MFA Status...");
    const result = await listMFAFactors();
    if (result.success && result.data) {
      // Check if there's at least one *verified* totp factor
      const verifiedFactorExists = result.data.totp?.some(
        (factor: Factor) => factor.status === "verified"
      );
      setTwoFactorEnabled(verifiedFactorExists);
      // console.log(
      //   "MFA Status Loaded:",
      //   verifiedFactorExists ? "Enabled" : "Disabled",
      //   result.data.totp
      // );
    } else {
      setTwoFactorEnabled(false);
      // console.warn("Failed to load MFA factors:", result.error);
      // Don't necessarily show toast for initial load failure unless persistent
      // toast.warning("无法检查 MFA 状态。");
    }
    setIsLoadingStatus(false);
  }, []);

  // 初始化加载是否已经开启MFA
  useEffect(() => {
    loadMFAStatus();
  }, [loadMFAStatus]);

  // --- Action Handlers ---
  const handleEnableMFA = async () => {
    setActionLoading(true);
    const enrollResult = await enrollMFA();
    if (enrollResult.success && enrollResult.data) {
      setMfaEnrollmentDetails(enrollResult.data);
      setEnrollmentModalOpen(true);
    } else {
      toast.error(enrollResult.error || "开启 MFA 失败，请重试。");
    }
    setActionLoading(false);
  };

  const handleDisableMFA = async () => {
    setActionLoading(true);
    const listResult = await listMFAFactors(); // Get current factors

    if (listResult.success && listResult.data?.totp?.length > 0) {
      const verifiedFactor = listResult.data.totp.find(
        (f: Factor) => f.status === "verified"
      );

      if (verifiedFactor) {
        // console.log("Disabling factor:", verifiedFactor.id);
        const unenrollResult = await unenrollMFA({
          factorId: verifiedFactor.id,
        });
        if (unenrollResult.success) {
          setTwoFactorEnabled(false); // Update UI immediately
          toast.success("已成功禁用双因素认证 (下次登录生效)。");
        } else {
          // Handle specific errors like 'factor_not_found' gracefully
          if (unenrollResult.error?.includes("Factor not found")) {
            // Simple check based on likely error message
            // console.warn(
            //   "Factor not found during unenroll attempt, syncing state."
            // );
            setTwoFactorEnabled(false); // Sync state
            toast.info("MFA 因子未找到，可能已被禁用。");
          } else {
            toast.error(unenrollResult.error || "禁用双因素认证失败。");
          }
        }
      } else {
        setTwoFactorEnabled(false); // No verified factor found, already disabled
        toast.info("未找到已验证的 MFA 因子。");
      }
    } else {
      setTwoFactorEnabled(false); // No factors found or error listing
      if (!listResult.success) {
        toast.warning(`无法确认 MFA 状态: ${listResult.error}`);
      } else {
        toast.info("当前没有 MFA 因子。");
      }
    }
    setActionLoading(false);
  };

  // Combined Toggle Handler
  const handleTwoFactorToggle = (checked: boolean) => {
    if (checked) {
      handleEnableMFA();
    } else {
      handleDisableMFA();
    }
  };

  // Verification Handler
  const handleVerifyMFA = async () => {
    if (!mfaEnrollmentDetails || verificationCode.length !== 6) {
      setVerificationError("请输入有效的 6 位验证码。");
      return;
    }
    setActionLoading(true);
    setVerificationError("");

    // Call verifyMFA API function
    const result = await verifyMFA({
      factorId: mfaEnrollmentDetails.id,
      code: verificationCode,
    });

    if (result.success) {
      toast.success("双因素认证已成功启用！");
      setEnrollmentModalOpen(false);
      setTwoFactorEnabled(true); // Set enabled state
      setVerificationCode("");
      setMfaEnrollmentDetails(null);
    } else {
      const errorMsg = result.error || "验证码无效或已过期，请重试。";
      setVerificationError(errorMsg);
      toast.error(errorMsg);
    }
    setActionLoading(false);
  };

  // Cancel Enrollment Handler
  const handleCancelEnrollment = useCallback(async () => {
    const factorIdToCancel = mfaEnrollmentDetails?.id;
    // Close modal and reset UI state first
    setEnrollmentModalOpen(false);
    setMfaEnrollmentDetails(null);
    setVerificationCode("");
    setVerificationError("");

    if (factorIdToCancel) {
      // Attempt unenroll in background - don't block UI, don't show toast on success
      setActionLoading(true); // Briefly indicate activity
      try {
        await unenrollMFA({ factorId: factorIdToCancel });
        console.log(
          "Cancelled pending MFA enrollment, factor unenrolled:",
          factorIdToCancel
        );
      } catch (err: any) {
        // Ignore factor_not_found, log others
        if (!err?.message?.includes("Factor not found")) {
          console.error("Unexpected error unenrolling during cancel:", err);
        }
      } finally {
        setActionLoading(false);
        // Refresh status just in case
        loadMFAStatus();
      }
    }
  }, [mfaEnrollmentDetails, loadMFAStatus]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>安全设置</CardTitle>
          <CardDescription>管理系统安全和访问控制</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingStatus ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              <Loader className="mr-2 size-4 animate-spin" /> 加载 MFA 状态...
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor" className="text-base font-medium">
                  双因素认证 (MFA)
                </Label>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? "已启用，提高账户安全性。"
                    : "未启用，建议开启以保护账户。"}
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
                disabled={actionLoading} // Disable during toggle action
                aria-label="双因素认证开关"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={enrollmentModalOpen}
        onOpenChange={(open) => !open && handleCancelEnrollment()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>启用双因素认证 (MFA)</DialogTitle>
            <DialogDescription>
              使用认证器应用 (如 Google Authenticator, Authy)
              扫描二维码或手动输入密钥。
            </DialogDescription>
          </DialogHeader>

          {mfaEnrollmentDetails && (
            <div className="space-y-4 pt-2 pb-4 px-1">
              {/* QR Code Section */}
              <div className="flex flex-col items-center rounded-lg border p-4 bg-muted/50">
                <p className="text-sm text-center mb-3">扫描二维码:</p>
                {/* Use Next Image for better optimization */}
                <div className="relative w-48 h-48 mb-3 bg-white p-1 rounded">
                  {" "}
                  {/* White background for QR */}
                  <Image
                    src={mfaEnrollmentDetails.qr_code}
                    alt="MFA QR Code"
                    width={192} // Example size, should match container
                    height={192}
                  />
                </div>

                <p className="text-xs text-center text-muted-foreground mb-2">
                  或手动输入密钥:
                </p>
                {/* Secret Key with Copy Button */}
                <div className="flex items-center gap-2 w-full max-w-xs mx-auto">
                  <Input
                    readOnly
                    value={mfaEnrollmentDetails.secret}
                    className="flex-1 font-mono text-sm h-8 text-center bg-background"
                  />
                  <CopyButton
                    valueToCopy={mfaEnrollmentDetails.secret}
                    size="sm"
                  />
                </div>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-1">
                <Label htmlFor="verification-code">输入 6 位验证码</Label>
                <Input
                  id="verification-code"
                  type="text" // Use text to allow leading zeros if needed by user
                  inputMode="numeric" // Hint for mobile keyboards
                  pattern="[0-9]*" // Allow only numbers
                  autoComplete="one-time-code" // Browser hint
                  value={verificationCode}
                  onChange={(e) => {
                    // Allow only digits and max 6 chars
                    const val = e.target.value.replace(/\D/g, "");
                    setVerificationCode(val.slice(0, 6));
                    setVerificationError(""); // Clear error on input
                  }}
                  placeholder="来自验证器应用"
                  maxLength={6}
                  className={cn(
                    "h-10 text-lg tracking-widest text-center",
                    verificationError &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={actionLoading}
                />
                {verificationError && (
                  <p className="text-destructive text-sm px-1">
                    {verificationError}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={handleCancelEnrollment}
                disabled={actionLoading}
              >
                取消
              </Button>
            </DialogClose>
            <Button
              onClick={handleVerifyMFA}
              disabled={actionLoading || verificationCode.length !== 6}
              className="min-w-[120px]"
            >
              {actionLoading && <Loader className="mr-2 size-4 animate-spin" />}
              验证并启用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecuritySetting;
