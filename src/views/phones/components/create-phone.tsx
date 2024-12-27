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
import { phoneSchema, PhoneSchema } from "@/views/phones/schema/phone.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { createNewPhone } from "@/views/phones/api/phone";

interface CreatePhoneProps {
  brandId: string;
}

export const CreatePhone = ({ brandId }: CreatePhoneProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      name: "",
      isTablet: false,
      code: undefined,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: PhoneSchema) => {
    const { msg, status } = await createNewPhone(values, parseInt(brandId));
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
      title="新手机"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 space-y-2"
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
            添加
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
