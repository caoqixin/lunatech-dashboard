"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  Supplier,
  SupplierSchema,
} from "@/views/supplier/schema/supplier.schema";
import { createSupplier } from "@/views/supplier/api/supplier";

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

interface CreateSupplierProps {
  onSuccess?: () => void;
}

export const CreateSupplier = ({ onSuccess }: CreateSupplierProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<Supplier>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      name: "",
      description: "",
      site: "",
      username: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset(); // 关闭时重置表单
    }
  };

  const onSubmit = async (values: Supplier) => {
    try {
      const { msg, status } = await createSupplier(values);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // 关闭
        onSuccess?.(); // 调用回调
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("创建失败，请稍后重试。");
      console.error("Create supplier error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新增供应商
        </Button>
      }
      title="添加新供应商"
      dialogClassName="sm:max-w-lg"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4 px-1"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>供应商名称 *</FormLabel>
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
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>描述 (可选)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="例如：主营屏幕、电池"
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
            name="site"
            render={({ field }) => (
              <FormItem>
                <FormLabel>登录网址 (可选)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://..."
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>登录用户名 (可选)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="供应商网站用户名"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>登录密码 (可选)</FormLabel>
                <FormControl>
                  {/* 考虑使用 type="password" */}
                  <Input
                    type="password"
                    placeholder="供应商网站密码"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="sm:col-span-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              添加供应商
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
