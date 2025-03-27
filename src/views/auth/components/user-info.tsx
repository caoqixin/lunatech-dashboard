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
import { useEffect, useState } from "react";
import { updateUserName } from "../api/user";
import { toast } from "sonner";
import { useUser } from "@/store/use-user";
import { Loader, User } from "lucide-react";

interface UserInfoProps {
  userName: string;
}

export const UserInfo = ({ userName }: UserInfoProps) => {
  const router = useRouter();
  const [hasChanged, setHasChanged] = useState(false);
  const setUserName = useUser((state) => state.updateUserName);

  const form = useForm<UpdateUserName>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: userName,
    },
  });

  const {
    formState: { isSubmitting },
    control,
    reset,
  } = form;

  const watchedName = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    setHasChanged(watchedName !== userName && watchedName?.trim() !== "");
  }, [watchedName, userName]);

  useEffect(() => {
    reset({
      name: userName,
    });
  }, [userName, reset]);

  const onSubmit = async (values: UpdateUserName) => {
    if (values.name.trim() === "") {
      toast.error("用户名不能为空");
      return;
    }

    try {
      const { msg, status } = await updateUserName(values);
      if (status == "success") {
        setUserName(values.name);
        toast.success(msg);
        router.refresh();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("更新用户名失败");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="size-4" /> 用户名
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  className="transition-all"
                />
              </FormControl>
              <FormDescription>您的用户名将显示在个人资料中</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasChanged || isSubmitting}
            onClick={() => {
              // 重置为初始值
              reset({ name: userName });
              setHasChanged(false);
            }}
          >
            取消
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!hasChanged || isSubmitting}
            className="flex items-center gap-x-2 transition-all"
          >
            {isSubmitting && <Loader className="animate-spin size-4" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
};
