"use client";

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
  Category,
  CategorySchema,
  CategoryType,
} from "@/views/category/schema/category.schema";
import { updateComponentCategory } from "../api/component";
import { updateProblem } from "../api/problem";
import type { CategoryComponent } from "@/lib/types";

interface EditCategoryProps {
  category: CategoryComponent;
  type: CategoryType;
  /**
   * 触发按钮 (现在由父组件提供)
   */
  triggerButton: React.ReactNode;
  /**
   * 编辑成功后的回调 (可选)
   */
  onSuccess?: () => void;
}

export const EditCategory = ({
  category,
  type,
  triggerButton, // 接收 trigger
  onSuccess,
}: EditCategoryProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category.name ?? "",
    },
  });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  const isComponent = type === CategoryType.COMPONENT;
  const title = isComponent ? "修改配件分类" : "修改维修故障";
  const label = isComponent ? "分类名称" : "故障名称";

  // Reset form when category changes or modal opens/closes
  useEffect(() => {
    if (category) {
      form.reset({ name: category.name ?? "" });
    }
  }, [category, form.reset]);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset({ name: category?.name ?? "" }); // 关闭时重置为原始值
    }
  };

  const onSubmit = async (values: Category) => {
    // Prevent submission if nothing changed
    if (!isDirty) {
      handleModalChange(false);
      return;
    }

    try {
      const action = isComponent ? updateComponentCategory : updateProblem;
      const { msg, status } = await action(values, category.id);

      if (status == "success") {
        toast.success(msg);
        handleModalChange(false); // Close modal
        onSuccess?.(); // Call success callback
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("操作失败，请稍后重试。");
      console.error("Update category error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={title}
      dialogClassName="sm:max-w-sm"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`请输入新的${label}`}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader className="mr-2 size-4 animate-spin" />
            ) : null}
            保存修改
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
