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
import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthError } from "@supabase/supabase-js";

export default function LoginForm() {
  const router = useRouter();
  const [showMFADialog, setShowMFADialog] = useState(false);
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
  } = form;

  const onSubmit = async (values: Login) => {
    const { msg, status } = await login(values);
    if (status == "success") {
      try {
        const { success, data } = await isNeedVerify();

        if (success && data) {
          setLoginCredentials(values);
          setShowMFADialog(true);
        } else {
          toast.success(msg);
          router.replace("/dashboard");
        }
      } catch (error) {
        toast.error("登录失败，请重试");
      }
    } else {
      toast.error(msg);
    }
  };

  const handleMFAVerification = async (mfaCode: string) => {
    if (!loginCredentials) {
      toast.error("登录凭证丢失，请重新登录");
      return;
    }

    try {
      const factors = await listMFAFactors();

      const totpFactor = factors.data.totp[0];

      if (!totpFactor) {
        throw new Error("No TOTP factors found!");
      }

      const factorId = totpFactor.id;

      const result = await verifyMFA({ factorId, code: mfaCode });

      if (result.success) {
        // MFA successful
        toast.success("登录成功");
        router.replace("/dashboard");
        setShowMFADialog(false);
      }
    } catch (error) {
      toast.error((error as AuthError).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">
            Luna Tech
          </CardTitle>
          <CardDescription className="text-gray-500">
            新月手机维修系统登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      电子邮箱
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="输入您的电子邮箱"
                        disabled={isSubmitting}
                        {...field}
                        autoComplete="email"
                        className="dark:bg-gray-800 dark:text-white"
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      密码
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="输入您的密码"
                        disabled={isSubmitting}
                        {...field}
                        autoComplete="current-password"
                        className="dark:bg-gray-800 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
              >
                {isSubmitting ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* MFA Dialog */}
      <Dialog open={showMFADialog} onOpenChange={setShowMFADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>两步验证</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              您的账户已启用两步验证，请输入验证码
            </p>
            <Input
              type="text"
              placeholder="输入6位验证码"
              maxLength={6}
              onChange={(e) => {
                const code = e.target.value;
                if (code.length === 6) {
                  handleMFAVerification(code);
                }
              }}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              请从您的身份验证应用程序中获取验证码
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
