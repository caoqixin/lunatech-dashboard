"use client";

import type { Customer } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  triggerButton: React.ReactNode;
  onSuccess?: () => void;
}

export const EditCustomer = ({
  customer,
  triggerButton,
  onSuccess,
}: EditCustomerProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CustomerSchema>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name ?? "",
      tel: customer.tel ?? "",
      email: customer.email ?? "",
    },
  });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  // Reset form when customer data changes or modal opens/closes
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name ?? "",
        tel: customer.tel ?? "",
        email: customer.email ?? "",
      });
    }
  }, [customer, form.reset]);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset to original values on close if not submitted
      form.reset({
        name: customer?.name ?? "",
        tel: customer?.tel ?? "",
        email: customer?.email ?? "",
      });
    }
  };

  const onSubmit = async (values: CustomerSchema) => {
    if (!isDirty) {
      handleModalChange(false); // Close if nothing changed
      return;
    }
    try {
      const { msg, status } = await updateCustomer(values, customer.id);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("更新失败，请稍后重试。");
      console.error("Update customer error:", error);
    }
  };

  useEffect(() => {
    form.reset({
      name: customer.name,
      tel: customer.tel ?? "",
      email: customer.email ?? "",
    });
  }, [customer]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={`修改客户: ${customer?.name ?? ""}`}
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
                  <Input {...field} disabled={isSubmitting} />
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
                  <Input type="tel" {...field} disabled={isSubmitting} />
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
                  <Input type="email" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : null}
              保存修改
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
