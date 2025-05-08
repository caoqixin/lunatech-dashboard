"use client";

import {
  Category,
  CategorySchema,
  CategoryType,
} from "@/views/category/schema/category.schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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
import { createComponentCategory } from "@/views/category/api/component";
import { createProblem } from "@/views/category/api/problem";

interface CreateCategoryProps {
  type: CategoryType;
  /**
   * 创建成功后的回调函数 (可选)
   */
  onSuccess?: () => void;
}

export const CreateCategory = ({ type, onSuccess }: CreateCategoryProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const isComponent = type === CategoryType.COMPONENT;
  const title = isComponent ? "新增配件分类" : "新增维修故障分类";
  const label = isComponent ? "配件分类名称" : "维修故障名称";

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset(); // 关闭时重置表单
    }
  };

  const onSubmit = async (values: Category) => {
    try {
      const action = isComponent ? createComponentCategory : createProblem;
      const { msg, status } = await action(values);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // 关闭模态框
        onSuccess?.(); // 调用成功回调
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("操作失败，请稍后重试。");
      console.error("Create category error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 size-4" /> {title}
        </Button>
      }
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
                    placeholder={`请输入${label}`}
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
            添加
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
