"use client";

import { Customer } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ResponsiveModal } from "@/components/custom/responsive-modal";

import { Loader, Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  customerSchema,
  CustomerSchema,
} from "@/views/customer/schema/customer.schema";
import { updateCustomer } from "@/views/customer/api/customer";

interface EditCustomerProps {
  customer: Customer;
  isDropDownMenu?: boolean;
  onCancel?: () => void;
}

export const EditCustomer = ({
  customer,
  isDropDownMenu,
  onCancel,
}: EditCustomerProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      tel: customer.tel ?? "",
      email: customer.email ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: CustomerSchema) => {
    const { msg, status } = await updateCustomer(values, customer.id);
    if (status == "success") {
      toast.success(msg);
      if (isDropDownMenu) {
        onCancel?.();
      } else {
        setOpen(false);
      }
      router.refresh();
    } else {
      toast.error(msg);
    }
  };

  useEffect(() => {
    form.reset({
      name: customer.name,
      tel: customer.tel ?? "",
      email: customer.email ?? "",
    });
  }, [customer]);

  if (isDropDownMenu) {
    return (
      <ResponsiveModal
        open={open}
        onOpen={setOpen}
        dropdownMenu={isDropDownMenu}
        title="更新客户资料"
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
              更新资料
            </Button>
          </form>
        </Form>
      </ResponsiveModal>
    );
  }

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      triggerButton={
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <Pencil className="size-4" /> 修改
        </Button>
      }
      title="更新客户资料"
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
            更新资料
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
