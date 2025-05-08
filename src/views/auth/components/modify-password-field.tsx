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
import { useCallback, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader } from "lucide-react";

type PasswordField = "password" | "confirmPassword";

export const ModifyPasswordField = () => {
  const [showPassword, setShowPassword] = useState<
    Record<PasswordField, boolean>
  >({
    password: false,
    confirmPassword: false,
  });

  const form = useForm<ModifyPassword>({
    resolver: zodResolver(ModifyPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
    control,
    reset,
    handleSubmit,
  } = form;

  const togglePasswordVisibility = useCallback((field: PasswordField) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const onSubmit = async (values: ModifyPassword) => {
    try {
      const { msg, status } = await updatePassword(values.confirmPassword);

      if (status == "success") {
        toast.success(msg);
        reset();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("修改密码失败，请稍后重试");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm">
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
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => togglePasswordVisibility("password")}
                    aria-label={showPassword.password ? "隐藏密码" : "显示密码"}
                  >
                    {showPassword.password ? (
                      <EyeOff className="size-4 text-muted-foreground" />
                    ) : (
                      <Eye className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription className="text-xs">
                至少包含 6 个字符
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <KeyRound className="size-4" /> 确认新密码
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="再次输入新密码"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    aria-label={
                      showPassword.confirmPassword ? "隐藏密码" : "显示密码"
                    }
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
        <div className="flex justify-end gap-x-2 pt-2">
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={() => reset()}
            >
              取消
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!isValid || isSubmitting || !isDirty}
            className="min-w-[90px]"
          >
            {isSubmitting && <Loader className="mr-1.5 animate-spin size-4" />}
            保存密码
          </Button>
        </div>
      </form>
    </Form>
  );
};
