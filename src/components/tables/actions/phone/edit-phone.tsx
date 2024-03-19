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
import { Phone } from "@/lib/definitions";
import { PhoneSchema } from "@/schemas/brand-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function EditPhone(phone: Phone) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PhoneSchema>>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: {
      name: phone.name,
      code: phone.code || "",
      isTablet: phone.isTablet,
    },
  });

  const onSubmit = async (values: z.infer<typeof PhoneSchema>) => {
    const res = await fetch(
      `http://localhost:3000/api/v1/brands/phones/${phone.id}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
      }
    );

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
          <DialogTitle>修改型号</DialogTitle>
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
              <Button type="submit">修改</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
