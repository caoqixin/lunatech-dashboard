"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateUserName } from "@/lib/user";
import { UserSchema, UserSchemaValue } from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface UserInfoFormProps {
  initialData: {
    name: string;
  };
}

export default function UserInfoForm({ initialData }: UserInfoFormProps) {
  const form = useForm<UserSchemaValue>({
    resolver: zodResolver(UserSchema),
    defaultValues: initialData,
  });

  const [isPending, startTransition] = useTransition();
  const [pending, setPending] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  const name = form.watch("name");

  const cancelAction = (e: FormEvent) => {
    e.preventDefault();

    form.resetField("name");
  };

  useEffect(() => {
    if (name !== initialData.name) {
      setPending(false);
    } else {
      setPending(true);
    }
  }, [name]);

  function onSubmit(data: UserSchemaValue) {
    startTransition(async () => {
      const { msg, status } = await updateUserName(data.name);

      if (status == "error") {
        toast({
          title: msg,
          variant: "destructive",
        });
      } else {
        toast({
          title: msg,
        });
        setPending(true);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 my-4 justify-end">
          <Button
            type="button"
            disabled={pending || isPending}
            onClick={cancelAction}
            variant="secondary"
          >
            取消
          </Button>
          <Button type="submit" disabled={pending || isPending}>
            保存
          </Button>
        </div>
      </form>
    </Form>
  );
}
