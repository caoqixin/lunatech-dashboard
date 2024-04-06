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
import { signOut } from "@/lib/actions/auth";
import { updateUserPassword } from "@/lib/user";
import {
  ModifyPasswordSchema,
  ModifyPasswordSchemaValue,
} from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export default function ModifyPassword() {
  const form = useForm<ModifyPasswordSchemaValue>({
    resolver: zodResolver(ModifyPasswordSchema),
    defaultValues: {
      password: "",
      confirmation_password: "",
    },
  });

  const [pending, setPending] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { password, confirmation_password } = form.watch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (password !== "" && confirmation_password !== "") {
      setPending(false);
    } else {
      setPending(true);
    }
  }, [password, confirmation_password]);

  const cancelAction = (e: FormEvent) => {
    e.preventDefault();

    form.reset();
  };

  function verification(field: "password" | "confirmation_password") {
    form.trigger(field);
  }
  function onSubmit(data: ModifyPasswordSchemaValue) {
    startTransition(async () => {
      const { msg, status } = await updateUserPassword(data.password);
      if (status == "error") {
        toast({
          title: msg,
          variant: "destructive",
        });
      } else {
        await signOut();
        toast({
          title: msg,
        });
      }
    });

    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>新密码</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
                  onBlur={() => verification("password")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmation_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  type="password"
                  onBlur={() => verification("confirmation_password")}
                />
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
            修改
          </Button>
        </div>
      </form>
    </Form>
  );
}
