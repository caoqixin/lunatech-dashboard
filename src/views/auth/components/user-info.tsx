"use client";

import {
  Form,
  FormControl,
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
import { Loader } from "lucide-react";

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
  } = form;

  const watchedName = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    setHasChanged(watchedName !== userName);
  }, [watchedName, userName]);

  useEffect(() => {
    form.reset({
      name: userName,
    });
  }, [userName]);

  const onSubmit = async (values: UpdateUserName) => {
    const { msg, status } = await updateUserName(values);
    if (status == "success") {
      setUserName(values.name);
      toast.success(msg);
      router.refresh();
    } else {
      toast.error(msg);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 space-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-x-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!hasChanged || isSubmitting}
            onClick={() => {
              // 重置为初始值
              form.reset({ name: userName });
              setHasChanged(false);
            }}
          >
            取消
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!hasChanged || isSubmitting}
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
