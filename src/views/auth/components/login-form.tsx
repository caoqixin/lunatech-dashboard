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
import { useNavigationStore } from "@/store/use-navigation-store";

export default function LoginForm() {
  const router = useRouter();
  const setTitle = useNavigationStore((state) => state.setTitle);

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
      toast.success(msg);
      setTitle("首页");
      router.replace("/dashboard");
    } else {
      toast.error(msg);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email"
                    disabled={isSubmitting}
                    {...field}
                    autoComplete="none"
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
              <FormItem className="mt-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="密码"
                    disabled={isSubmitting}
                    autoComplete="none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isSubmitting}
            className="ml-auto w-full"
            type="submit"
          >
            登录
          </Button>
        </form>
      </Form>
    </>
  );
}
