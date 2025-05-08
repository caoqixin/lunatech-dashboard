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
import { UpdateUserName, updateUserNameSchema } from "../schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { updateUserName } from "../api/user";
import { toast } from "sonner";
import { useUser } from "@/store/use-user";
import { Loader, User } from "lucide-react";

interface UserInfoProps {
  initialUserName: string;
}

export const UserInfo = ({ initialUserName }: UserInfoProps) => {
  const router = useRouter();
  // Get update function and current name from store
  const { userName: storeUserName, updateUserName: updateStoreUserName } =
    useUser((state) => ({
      userName: state.userName,
      updateUserName: state.updateUserName,
    }));

  // Initialize form with store value OR initial prop
  const currentName = storeUserName || initialUserName;

  const form = useForm<UpdateUserName>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const {
    formState: { isSubmitting, isDirty },
    control,
    reset,
    handleSubmit,
  } = form;

  const watchedName = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    const nameToUse = storeUserName || initialUserName;
    // Only reset if form isn't dirty to avoid losing user input
    if (!isDirty) {
      reset({ name: nameToUse });
    }
  }, [initialUserName, storeUserName, reset, isDirty]);

  const handleCancel = useCallback(() => {
    reset({ name: currentName }); // Reset form to current value
  }, [reset, currentName]);

  const onSubmit = useCallback(
    async (values: UpdateUserName) => {
      const newName = values.name.trim();
      if (!newName) {
        toast.error("用户名不能为空。");
        reset({ name: currentName }); // Reset to current value if empty submit attempt
        return;
      }

      try {
        const { msg, status } = await updateUserName(values);
        if (status == "success") {
          updateStoreUserName(newName);
          toast.success(msg || "用户名更新成功！");
          reset({ name: newName });
          router.refresh();
        } else {
          toast.error(msg);
        }
      } catch (error) {
        toast.error("更新用户名失败");
      }
    },
    [currentName, reset, updateStoreUserName, router]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5 text-sm">
                <User className="size-4" /> 用户名
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="输入新的用户名"
                  className="transition-all"
                />
              </FormControl>
              <FormDescription className="text-xs">
                这是您在系统中的显示名称。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isDirty && (
          <div className="flex justify-end gap-x-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="min-w-[70px]"
            >
              {isSubmitting && (
                <Loader className="mr-1.5 animate-spin size-4" />
              )}
              保存
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
