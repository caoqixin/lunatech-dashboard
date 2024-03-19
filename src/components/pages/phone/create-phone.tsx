"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { PhoneSchema } from "@/schemas/brand-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreatePhone = ({ brandId }: { brandId: number }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof PhoneSchema>>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      name: "",
      code: "",
      isTablet: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof PhoneSchema>) => {
    const res = await fetch(`http://localhost:3000/api/v1/brands/${brandId}`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (data.status == "success") {
      toast({
        title: data.msg,
      });
    } else {
      toast({
        title: data.msg,
        variant: "destructive",
      });
    }

    setOpen(false);
    router.refresh();
    form.reset();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm">
          <PlusIcon className="mr-2 h-4 w-4" /> 新增
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加机型</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="col-span-2 ml-auto" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">型号</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="col-span-2 ml-auto" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTablet"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">平板设备</FormLabel>
                  <FormControl className="col-span-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="col-span-2 ml-auto" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">添加</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePhone;
