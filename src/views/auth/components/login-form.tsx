"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { Login, loginSchema } from "@/views/auth/schema/login.schema";
import { login } from "@/views/auth/api/auth";
import { useState, useCallback } from "react";
import {
  isNeedVerify,
  listMFAFactors,
  verifyMFA,
} from "@/views/setting/api/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { AuthError, Factor } from "@supabase/supabase-js";
import { KeyRound, Loader } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showMFADialog, setShowMFADialog] = useState(false);

  // Store factorId needed for verification when MFA dialog opens
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState(""); // State for the OTP code
  const [isVerifyingMFA, setIsVerifyingMFA] = useState(false); // Loading state for MFA verification
  const [mfaError, setMfaError] = useState<string | null>(null); // Error specific to MFA dialog

  const [loginCredentials, setLoginCredentials] = useState<Login | null>(null);

  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const onSubmit = async (values: Login) => {
    setMfaError(null);

    try {
      // Step 1: Basic Login
      const loginResult = await login(values);

      if (loginResult.status !== "success") {
        toast.error(loginResult.msg || "邮箱或密码错误。");
        return;
      }

      // Step 2: Check if MFA verification is needed
      // console.log("Login successful, checking MFA requirement...");
      const verifyCheck = await isNeedVerify();
      if (verifyCheck.success) {
        console.log("MFA verification needed.");
        // Need to get the factor ID to use for verification
        const factorsResult = await listMFAFactors();
        if (factorsResult.success && factorsResult.data?.totp?.length > 0) {
          // Assuming the first *verified* or *enabled* factor is the one to use
          // Supabase might prioritize one if multiple exist. Find the relevant one.
          const relevantFactor = factorsResult.data.totp.find(
            (f: Factor) => f.status === "verified"
          ); // Prioritize verified
          if (relevantFactor) {
            setMfaFactorId(relevantFactor.id);
            setShowMFADialog(true); // Show MFA dialog
          } else {
            // console.error(
            //   "isNeedVerify is true, but no verified TOTP factor found.",
            //   factorsResult.data.totp
            // );
            toast.error(
              "需要 MFA 验证，但未找到有效的验证器设置。请联系管理员。"
            );
          }
        } else {
          // console.error(
          //   "isNeedVerify is true, but failed to list factors or no TOTP factors exist.",
          //   factorsResult
          // );
          toast.error("需要 MFA 验证，但无法获取验证器信息。");
        }
      } else {
        console.log("MFA verification not needed or already passed.");
        // No MFA needed or already satisfied (e.g., remembered device)
        toast.success(loginResult.msg || "登录成功");
        router.replace("/dashboard"); // Redirect directly
      }
    } catch (error) {
      // console.error("Login process error:", error);
      // Handle errors from isNeedVerify or listMFAFactors if they throw
      toast.error("登录过程中发生错误，请重试。");
    }
  };

  // --- MFA Verification Handler ---
  const handleMFAVerification = useCallback(async () => {
    if (!mfaFactorId || mfaCode.length !== 6) {
      setMfaError("请输入 6 位验证码。");
      return;
    }

    setIsVerifyingMFA(true);
    setMfaError(null);

    try {
      console.log(`Verifying MFA code for factorId: ${mfaFactorId}`);
      const result = await verifyMFA({ factorId: mfaFactorId, code: mfaCode });

      if (result.success) {
        toast.success("验证成功，正在登录...");
        setShowMFADialog(false);
        setMfaCode(""); // Clear code
        setMfaFactorId(null);
        router.replace("/dashboard"); // Redirect after successful MFA
      } else {
        const errorMsg = result.error || "验证码无效或已过期，请重试。";
        setMfaError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg =
        (error as AuthError)?.message || "验证过程中发生未知错误。";
      setMfaError(errorMsg);
      toast.error(errorMsg);
      console.error("MFA Verification exception:", error);
    } finally {
      setIsVerifyingMFA(false);
    }
  }, [mfaFactorId, mfaCode, router]); // Dependencies

  const handleDialogClose = () => {
    // Reset MFA state when dialog is closed manually
    setShowMFADialog(false);
    setMfaCode("");
    setMfaFactorId(null);
    setMfaError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/30 via-background to-background p-4">
      <Card className="w-full max-w-sm shadow-xl dark:border-border/50">
        {" "}
        {/* Reduced max-w */}
        <CardHeader className="text-center space-y-1">
          {/* Optional: Add Logo */}
          {/* <img src="/logo.png" alt="Luna Tech Logo" className="w-16 h-16 mx-auto mb-2" /> */}
          <CardTitle className="text-2xl font-bold">
            {" "}
            {/* Adjusted size */}
            Luna Tech
          </CardTitle>
          <CardDescription>后台管理系统登录</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电子邮箱</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Display login errors if any */}
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
              <Button disabled={isSubmitting} className="w-full" type="submit">
                {isSubmitting && (
                  <Loader className="mr-2 size-4 animate-spin" />
                )}
                登录
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* MFA Dialog */}
      <Dialog
        open={showMFADialog}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" /> 两步验证 (MFA)
            </DialogTitle>
            <DialogDescription>
              您的账户已启用 MFA。请输入您身份验证器应用中的 6 位验证码。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {/* Use InputOTP for better UX */}
            <InputOTP
              maxLength={6}
              value={mfaCode}
              onChange={(value) => {
                setMfaCode(value);
                setMfaError(null); // Clear error on input
              }}
              disabled={isVerifyingMFA}
            >
              <InputOTPGroup className="w-full justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              {/* Optional: Add separator for visual grouping */}
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup className="w-full justify-center">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {/* Display MFA specific errors */}
            {mfaError && (
              <p className="text-sm font-medium text-destructive text-center pt-1">
                {mfaError}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={isVerifyingMFA}
            >
              取消
            </Button>
            <Button
              onClick={handleMFAVerification}
              disabled={isVerifyingMFA || mfaCode.length !== 6}
              className="min-w-[90px]"
            >
              {isVerifyingMFA && (
                <Loader className="mr-2 size-4 animate-spin" />
              )}
              验证
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
