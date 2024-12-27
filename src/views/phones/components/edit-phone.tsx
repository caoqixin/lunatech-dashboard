"use client";

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
import { Phone } from "@/lib/types";
import { phoneSchema, PhoneSchema } from "@/views/phones/schema/phone.schema";
import { updatePhone } from "@/views/phones/api/phone";
import { Checkbox } from "@/components/ui/checkbox";

interface EditPhoneProps {
  phone: Phone;
  isDropDownMenu?: boolean;
  onCancel?: () => void;
}

export const EditPhone = ({
  phone,
  isDropDownMenu = false,
  onCancel,
}: EditPhoneProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: phone.name,
      isTablet: phone.isTablet,
      code: phone.code ?? undefined,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: PhoneSchema) => {
    const { msg, status } = await updatePhone(values, phone.id);
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
      name: phone.name,
      isTablet: phone.isTablet,
      code: phone.code ?? undefined,
    });
  }, [phone]);

  if (isDropDownMenu) {
    return (
      <ResponsiveModal
        open={open}
        onOpen={setOpen}
        dropdownMenu={isDropDownMenu}
        title="修改供应商"
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
              name="code"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mx-2">
                  <FormLabel className="text-nowrap min-w-16 text-right">
                    代号
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
              name="isTablet"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mx-2">
                  <FormLabel className="text-nowrap min-w-16 text-right mt-[8px]">
                    平板设备?
                  </FormLabel>
                  <div className="flex flex-col gap-1 w-full">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
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
              修改
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
      title="修改供应商"
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
            name="code"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-16 text-right">
                  代号
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
            name="isTablet"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-16 text-right mt-[8px]">
                  平板设备?
                </FormLabel>
                <div className="flex flex-col gap-1 w-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
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
            修改
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
