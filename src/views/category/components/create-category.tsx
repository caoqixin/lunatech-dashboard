"use client";

import {
  Category,
  CategorySchema,
  CategoryType,
} from "@/views/category/schema/category.schema";

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
import { createComponentCategory } from "@/views/category/api/component";
import { createProblem } from "@/views/category/api/problem";

interface CreateCategoryProps {
  type: CategoryType;
}

export const CreateCategory = ({ type }: CreateCategoryProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<Category>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: Category) => {
    if (type === CategoryType.COMPONENT) {
      const { msg, status } = await createComponentCategory(values);
      if (status == "success") {
        toast.success(msg);
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(msg);
      }
    } else if (type === CategoryType.REPAIR) {
      const { msg, status } = await createProblem(values);
      if (status == "success") {
        toast.success(msg);
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      triggerButton={
        <Button className="text-xs md:text-sm">
          <PlusIcon className="mr-2 h-4 w-4" />{" "}
          {type === CategoryType.COMPONENT
            ? "新增配件分类"
            : "新增维修故障分类"}
        </Button>
      }
      title={
        type === CategoryType.COMPONENT ? "新增配件分类" : "新增维修故障分类"
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
            className="flex gap-2 items-center mx-4"
          >
            {isSubmitting && <Loader className="animate-spin" />}
            添加
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
