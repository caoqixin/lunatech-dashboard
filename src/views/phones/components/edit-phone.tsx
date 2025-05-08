"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ResponsiveModal } from "@/components/custom/responsive-modal";

import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Phone } from "@/lib/types";
import { phoneSchema, PhoneSchema } from "@/views/phones/schema/phone.schema";
import { updatePhone } from "@/views/phones/api/phone";
import { Checkbox } from "@/components/ui/checkbox";

interface EditPhoneProps {
  phone: Phone;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const EditPhone = ({
  phone,
  triggerButton,
  onSuccess,
}: EditPhoneProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: phone?.name ?? "",
      isTablet: phone?.isTablet ?? false,
      code: phone?.code ?? "",
    },
  });

  const {
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  // Reset form if phone prop changes or modal closes without save
  useEffect(() => {
    if (phone && !isSubmitting) {
      // Avoid reset during submission
      reset({
        name: phone.name ?? "",
        isTablet: phone.isTablet ?? false,
        code: phone.code ?? "",
      });
    }
  }, [phone, reset, isSubmitting, open]);

  const handleModalChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    // Reset logic moved to useEffect
  }, []);

  const onSubmit = async (values: PhoneSchema) => {
    if (!isDirty) {
      // Don't submit if nothing changed
      handleModalChange(false);
      return;
    }
    const dataToSend = {
      ...values,
      code: values.code?.trim() || undefined, // Send undefined if empty string
    };

    try {
      const { msg, status } = await updatePhone(dataToSend, phone.id);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg || "更新失败");
      }
    } catch (error: any) {
      toast.error(`更新失败: ${error.message || "请稍后重试"}`);
      console.error("Update phone error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={`修改型号: ${phone?.name}`}
      dialogClassName="sm:max-w-md"
      showMobileFooter={false} // Use form buttons
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 px-1 pb-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>手机型号名称 *</FormLabel>{" "}
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>代号/内部标识 (可选)</FormLabel>{" "}
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    disabled={isSubmitting}
                  />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isTablet"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>这是一个平板设备?</FormLabel>
                  <FormDescription className="text-xs">
                    勾选此项如果这是平板电脑。
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleModalChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="min-w-[90px]"
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
