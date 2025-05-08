"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ResponsiveModal } from "@/components/custom/responsive-modal";

import {
  SupplierSchema as SupplierFormSchema,
  Supplier as SupplierSchema,
} from "@/views/supplier/schema/supplier.schema";
import { updateSupplier } from "@/views/supplier/api/supplier";

import { Loader } from "lucide-react";
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
import type { Supplier } from "@/lib/types";

interface EditSupplierProps {
  supplier: Supplier;
  triggerButton: React.ReactNode; // Receive trigger
  onSuccess?: () => void; // Success callback
}

export const EditSupplier = ({
  supplier,
  triggerButton,
  onSuccess,
}: EditSupplierProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<SupplierSchema>({
    resolver: zodResolver(SupplierFormSchema),
    defaultValues: {
      name: supplier.name,
      description: supplier.description ?? "",
      site: supplier.site ?? "",
      username: supplier.username ?? "",
      password: supplier.password ?? "",
    },
  });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  // Reset form when supplier data changes or modal opens/closes
  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name ?? "",
        description: supplier.description ?? "",
        site: supplier.site ?? "",
        username: supplier.username ?? "",
        password: supplier.password ?? "", // Reset password field too (maybe keep it empty?)
      });
    }
  }, [supplier, form.reset]);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset to original values on close if not submitted
      form.reset({
        name: supplier?.name ?? "",
        description: supplier?.description ?? "",
        site: supplier?.site ?? "",
        username: supplier?.username ?? "",
        password: supplier?.password ?? "",
      });
    }
  };

  const onSubmit = async (values: SupplierSchema) => {
    if (!isDirty) {
      handleModalChange(false); // Close if nothing changed
      return;
    }

    try {
      const { msg, status } = await updateSupplier(values, supplier.id);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("更新失败，请稍后重试。");
      console.error("Update supplier error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={`修改供应商: ${supplier?.name ?? ""}`}
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
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} disabled={isSubmitting} />
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
                  <Input {...field} disabled={isSubmitting} />
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
                  <Input {...field} disabled={isSubmitting} />
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
                {/* Consider masking or indicating it's present but not shown */}
                <FormControl>
                  <Input
                    type="password"
                    placeholder="如需修改请输入新密码"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="sm:col-span-2 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full"
            >
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              保存修改
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
