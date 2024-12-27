"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader, PlusIcon } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
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
import { toast } from "sonner";
import {
  customerSchema,
  CustomerSchema,
} from "@/views/customer/schema/customer.schema";
import { createCustomer } from "@/views/customer/api/customer";

export const CreateCustomer = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      tel: "",
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: CustomerSchema) => {
    const { msg, status } = await createCustomer(values);
    if (status == "success") {
      toast.success(msg);
      setOpen(false);
      form.reset();
      router.refresh();
    } else {
      toast.error(msg);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      triggerButton={
        <Button className="text-xs md:text-sm">
          <PlusIcon className="mr-2 h-4 w-4" /> 新增
        </Button>
      }
      title="添加新客户"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-16 text-right">
                  名称
                </FormLabel>
                <div className="flex flex-col gap-1 w-full">
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tel"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-16 text-right">
                  电话号码
                </FormLabel>
                <div className="flex flex-col gap-1 w-full">
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-16 text-right">
                  邮箱
                </FormLabel>
                <div className="flex flex-col gap-1 w-full">
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex gap-2 items-center"
          >
            {isSubmitting && <Loader className="animate-spin" />}
            添加
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
