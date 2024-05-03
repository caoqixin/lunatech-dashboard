"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateCategoryItem } from "@/lib/actions/server/category_items";
import { categoryItemValue } from "@/schemas/category-item-schema";
import { CategorySchema } from "@/schemas/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon, ReloadIcon } from "@radix-ui/react-icons";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function EditCategoryItems({ name, id }: { name: string; id: number }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const oldName = name;

  const form = useForm<categoryItemValue>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: name,
    },
  });

  const onSubmit = async (values: categoryItemValue) => {
    startTransition(async () => {
      const res = await updateCategoryItem(id, values, oldName);

      if (res.status === "success") {
        toast({
          title: res.msg,
        });
        setOpen(false);
      } else {
        toast({
          title: res.msg,
          variant: "destructive",
        });
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <Pencil2Icon className="w-4 h-4" /> 修改
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>修改分类</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">名称</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} disabled={pending} />
                  </FormControl>
                  <FormMessage className="col-span-2 ml-auto" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={pending}
                className="flex items-center gap-2"
              >
                {pending && <ReloadIcon className="animate-spin" />}
                修改
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
