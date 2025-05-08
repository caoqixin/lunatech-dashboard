"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";

import { Loader, PlusIcon } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { phoneSchema, PhoneSchema } from "@/views/phones/schema/phone.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { createNewPhone } from "@/views/phones/api/phone";

interface CreatePhoneProps {
  brandId: string;
  brandName?: string; // Optional: display brand name
  onSuccess?: () => void; // Success callback
}

export const CreatePhone = ({
  brandId,
  brandName,
  onSuccess,
}: CreatePhoneProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: "",
      isTablet: false,
      code: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const handleModalChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        reset({ name: "", isTablet: false, code: "" }); // Reset form on close
      }
    },
    [reset]
  );

  const onSubmit = async (values: PhoneSchema) => {
    const dataToSend = {
      ...values,
      code: values.code?.trim() || undefined,
    };

    try {
      const brandIdNumber = parseInt(brandId, 10); // Ensure ID is number for API
      if (isNaN(brandIdNumber)) throw new Error("无效的品牌 ID");

      const { msg, status } = await createNewPhone(dataToSend, brandIdNumber);
      if (status === "success") {
        toast.success(
          `为 ${brandName || "品牌"} 添加型号 ${values.name} 成功!`
        );
        handleModalChange(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg || "添加失败");
      }
    } catch (error: any) {
      toast.error(`添加失败: ${error.message || "请稍后重试"}`);
      console.error("Create phone error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新增型号
        </Button>
      }
      title={`为 ${brandName || `品牌ID ${brandId}`} 添加新型号`}
      dialogClassName="sm:max-w-md"
      showMobileFooter={false}
    >
      <Form {...form}>
        {/* Grid layout for form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 px-1 pb-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机型号名称 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="例如: iPhone 15 Pro Max"
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>代号/内部标识 (可选)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="例如: A2896"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  方便内部识别或与供应商沟通。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isTablet"
            render={({ field }) => (
              // Improved Checkbox layout
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
                    勾选此项如果添加的是 iPad, Galaxy Tab 等平板。
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
              disabled={isSubmitting}
              className="min-w-[90px]"
            >
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              添加
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
