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

export const ModifyPasswordField = () => {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

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
  } = form;

  const watchedPassword = useWatch({
    control,
    name: "password",
  });

  const watchedConfirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });

  useEffect(() => {
    if (
      watchedConfirmPassword === watchedPassword &&
      (watchedConfirmPassword !== "" || watchedPassword !== "")
    ) {
      setIsConfirmed(true);
    }
  }, [watchedPassword, watchedConfirmPassword]);

  const onSubmit = async (values: ModifyPassword) => {
    const { msg, status } = await updatePassword(values.confirmPassword);

    if (status == "success") {
      toast.success(msg);
      form.reset();
      setIsConfirmed(false);
      router.refresh();
    } else {
      toast.error(msg);
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
              <FormLabel>新密码</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
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
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-x-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!isConfirmed || isSubmitting}
            onClick={() => {
              // 重置为初始值
              form.reset();
              setIsConfirmed(false);
            }}
          >
            取消
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!isConfirmed || isSubmitting}
          >
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
};
