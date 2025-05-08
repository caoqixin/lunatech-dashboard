"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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

interface CreateCustomerProps {
  onSuccess?: () => void; // 添加 onSuccess
}
export const CreateCustomer = ({ onSuccess }: CreateCustomerProps) => {
  const [open, setOpen] = useState(false);
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

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset(); // 关闭时重置
    }
  };

  const onSubmit = async (values: CustomerSchema) => {
    try {
      const { msg, status } = await createCustomer(values);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // 关闭
        onSuccess?.(); // 调用回调
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("创建失败，请稍后重试。");
      console.error("Create customer error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange} // 使用 handler
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          {" "}
          {/* size=sm */}
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新增客户
        </Button>
      }
      title="添加新客户"
      dialogClassName="sm:max-w-md"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 px-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>客户名称 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="例如：张三"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>电话号码 *</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="用于搜索和联系"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱 (可选)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="可选，用于发送邮件"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : null}
              添加客户
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
