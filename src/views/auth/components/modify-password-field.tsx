"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { ModifyPassword, ModifyPasswordSchema } from "../schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "../api/user";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader } from "lucide-react";

type PasswordVisibility = {
  password: boolean;
  confirmPassword: boolean;
};

export const ModifyPasswordField = () => {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    password: false,
    confirmPassword: false,
  });

  const form = useForm<ModifyPassword>({
    resolver: zodResolver(ModifyPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const watchedPassword = useWatch({
    control,
    name: "password",
  });

  const watchedConfirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });

  // 检查密码是否匹配
  useEffect(() => {
    if (
      watchedPassword &&
      watchedConfirmPassword &&
      watchedConfirmPassword === watchedPassword &&
      watchedPassword.length >= 6
    ) {
      setIsConfirmed(true);
    } else {
      setIsConfirmed(false);
    }
  }, [watchedPassword, watchedConfirmPassword]);

  const togglePasswordVisibility = (
    field: "password" | "confirmPassword"
  ): void => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (values: ModifyPassword) => {
    try {
      const { msg, status } = await updatePassword(values.confirmPassword);

      if (status == "success") {
        toast.success(msg);
        reset();
        setIsConfirmed(false);
        router.refresh();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("修改密码失败，请稍后重试");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <KeyRound className="size-4" /> 新密码
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    type={showPassword.password ? "text" : "password"}
                    placeholder="请输入新密码"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {showPassword.password ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>新密码必须大于6位数</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <KeyRound className="size-4" /> 确认密码
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="请再次输入新密码"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!isConfirmed || isSubmitting}
            onClick={() => {
              // 重置为初始值
              reset();
              setIsConfirmed(false);
            }}
          >
            取消
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isConfirmed || isSubmitting}
            className="flex items-center gap-x-2"
          >
            {isSubmitting && <Loader className="animate-spin size-4" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
};
