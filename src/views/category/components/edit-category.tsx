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

import {
  Category,
  CategorySchema,
  CategoryType,
} from "@/views/category/schema/category.schema";
import { updateComponentCategory } from "../api/component";
import { updateProblem } from "../api/problem";
import { CategoryComponent } from "@/lib/types";

interface EditCategoryProps {
  category: CategoryComponent;
  type: CategoryType;
  isDropDownMenu?: boolean;
  onCancel?: () => void;
}

export const EditCategory = ({
  category,
  type,
  isDropDownMenu = false,
  onCancel,
}: EditCategoryProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category.name ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: Category) => {
    if (type === CategoryType.COMPONENT) {
      const { msg, status } = await updateComponentCategory(
        values,
        category.id
      );
      if (status == "success") {
        toast.success(msg);
        if (isDropDownMenu) {
          onCancel?.();
        } else {
          setOpen(false);
        }
        form.reset();
      } else {
        toast.error(msg);
      }
    } else if (type === CategoryType.REPAIR) {
      const { msg, status } = await updateProblem(values, category.id);
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
    }
  };

  useEffect(() => {
    form.reset({
      name: category.name ?? "",
    });
  }, [category]);

  if (isDropDownMenu) {
    return (
      <ResponsiveModal
        open={open}
        onOpen={setOpen}
        dropdownMenu={isDropDownMenu}
        title={
          type === CategoryType.COMPONENT
            ? "修改配件分类名称"
            : "修改维修故障名称"
        }
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
                  <FormLabel className="text-nowrap flex h-full items-center justify-end">
                    {type === CategoryType.COMPONENT
                      ? "配件分类名称"
                      : "维修故障名称"}
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
      title={
        type === CategoryType.COMPONENT
          ? "修改配件分类名称"
          : "修改维修故障名称"
      }
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
                <FormLabel className="text-nowrap flex h-full items-center justify-end">
                  {type === CategoryType.COMPONENT
                    ? "配件分类名称"
                    : "维修故障名称"}
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
