"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ResponsiveModal } from "@/components/custom/responsive-modal";

import {
  SupplierSchema as SupplierFormSchema,
  Supplier as SupplierSchema,
} from "@/views/supplier/schema/supplier.schema";
import { updateSupplier } from "@/views/supplier/api/supplier";

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
import { Supplier } from "@/lib/types";

interface EditSupplierProps {
  supplier: Supplier;
  isDropDownMenu?: boolean;
  onCancel?: () => void;
}

export const EditSupplier = ({
  supplier,
  isDropDownMenu = false,
  onCancel,
}: EditSupplierProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: SupplierSchema) => {
    const { msg, status } = await updateSupplier(values, supplier.id);
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
      name: supplier.name,
      description: supplier.description ?? "",
      site: supplier.site ?? "",
      username: supplier.username ?? "",
      password: supplier.password ?? "",
    });
  }, [supplier]);

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
                  <FormLabel className="text-nowrap min-w-12 text-right">
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
              name="description"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mx-2">
                  <FormLabel className="text-nowrap min-w-12 text-right">
                    描述
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
              name="site"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mx-2">
                  <FormLabel className="text-nowrap min-w-12 text-right">
                    网址
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
              name="username"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mx-2">
                  <FormLabel className="text-nowrap min-w-12 text-right">
                    用户名
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
              name="password"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 mx-2">
                  <FormLabel className="text-nowrap min-w-12 text-right">
                    密码
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
                <FormLabel className="text-nowrap min-w-12 text-right">
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
            name="description"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-12 text-right">
                  描述
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
            name="site"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-12 text-right">
                  网址
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
            name="username"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-12 text-right">
                  用户名
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
            name="password"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-12 text-right">
                  密码
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
            修改
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
