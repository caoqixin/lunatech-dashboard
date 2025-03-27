import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import {
  enrollMFA,
  verifyMFA,
  unenrollMFA,
  listMFAFactors,
  isMFAActivated,
} from "@/views/setting/api/auth";
import { MFAEnrollmentDetails } from "./types";
import { AuthError } from "@supabase/supabase-js";

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 初始化加载是否已经开启MFA
  useEffect(() => {
    const loadMFAFactors = async () => {
      setIsLoading(true);
      try {
        const { success, data } = await isMFAActivated();

        if (success && data) {
          const factors = await listMFAFactors();

          if (factors.success && factors.data.totp.length > 0) {
            setTwoFactorEnabled(true);
          }
        }
      } catch (err) {
        toast.error((err as AuthError).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMFAFactors();
  }, []);

  const handleTwoFactorToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      if (checked) {
        // 启用 MFA
        const result = await enrollMFA();
        if (result.success && result.data) {
          setMfaEnrollmentDetails(result.data);
          setEnrollmentModalOpen(true);
        } else {
          toast.error(result.error || "MFA 注册失败");
          setTwoFactorEnabled(false);
        }
      } else {
        // 禁用 MFA
        const factors = await listMFAFactors();

        if (factors.success && factors.data.totp.length > 0) {
          const currentMfaFactor = factors.data.totp[0];

          const result = await unenrollMFA({ factorId: currentMfaFactor.id });

          if (result.success) {
            setTwoFactorEnabled(false);
            toast.success("已成功禁用双因素认证");
            // 成功禁用之后需要退出登录才会生效
          } else {
            toast.error(result.error || "禁用双因素认证失败");
          }
        }
      }
    } catch (err) {
      toast.error("操作失败");
      setTwoFactorEnabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!mfaEnrollmentDetails) return;

    setIsLoading(true);
    try {
      const result = await verifyMFA({
        factorId: mfaEnrollmentDetails.id,
        code: verificationCode,
      });

      if (result.success) {
        toast.success("多因素认证设置成功");
        setEnrollmentModalOpen(false);
        setTwoFactorEnabled(true);
        setVerificationCode("");
      } else {
        setError(result.error || "验证失败");
      }
    } catch (err) {
      setError("验证过程出现错误");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEnrollment = async () => {
    try {
      if (mfaEnrollmentDetails) {
        await unenrollMFA({ factorId: mfaEnrollmentDetails.id });
      }

      setEnrollmentModalOpen(false);
      setTwoFactorEnabled(false);
      setMfaEnrollmentDetails(null);
      setVerificationCode("");
      setError("");
    } catch (error) {
      toast.error("操作失败");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>安全设置</CardTitle>
          <CardDescription>管理系统安全和访问控制</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">双因素认证</Label>
              <p className="text-sm text-gray-500">启用后登录需要额外验证</p>
            </div>
            <Switch
              id="two-factor"
              disabled={isLoading}
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={enrollmentModalOpen} onOpenChange={handleCancelEnrollment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>设置双因素认证</DialogTitle>
            <DialogDescription>
              使用身份验证器应用程序保护您的账户
            </DialogDescription>
          </DialogHeader>

          {mfaEnrollmentDetails && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="mb-4">
                  请使用 Google Authenticator 或 Authy 扫描以下二维码：
                </p>
                <img
                  src={mfaEnrollmentDetails.qr_code}
                  alt="MFA QR Code"
                  className="mx-auto mb-4 max-w-[250px]"
                />
                <p className="text-sm text-gray-600 mb-2">
                  无法扫描？使用以下密钥：
                </p>
                <div className="bg-gray-100 p-2 rounded text-center font-mono">
                  {mfaEnrollmentDetails.secret}
                </div>
              </div>

              <div>
                <Label htmlFor="verification-code">输入验证码</Label>
                <input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.trim())}
                  placeholder="输入 6 位验证码"
                  maxLength={6}
                  className="w-full p-2 border rounded mt-2"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <div className="flex justify-between space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEnrollment}
                  disabled={isLoading}
                >
                  取消
                </Button>
                <Button
                  onClick={handleVerifyMFA}
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  验证并启用
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecuritySetting;
