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
import { updateCustomer } from "@/lib/actions/server/customers";
import { CustomerSchema, customerSchemaValue } from "@/schemas/customer-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer } from "@prisma/client";
import { Pencil2Icon, ReloadIcon } from "@radix-ui/react-icons";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function EditCustomer(customer: Customer) {
  const { name, tel, email, id } = customer;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<customerSchemaValue>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      name: name,
      tel: tel,
      email: email ?? "",
    },
  });

  const onSubmit = async (values: customerSchemaValue) => {
    startTransition(async () => {
      const data = await updateCustomer(id, values);

      if (data.status === "success") {
        toast({
          title: data.msg,
        });
        setOpen(false);
      } else {
        toast({
          title: data.msg,
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
          <DialogTitle>修改客户资料</DialogTitle>
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
                  <FormLabel className="text-right">用户姓名</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} disabled={pending} />
                  </FormControl>
                  <FormMessage className="col-span-2 ml-auto" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">联系号码</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} disabled={pending} />
                  </FormControl>
                  <FormMessage className="col-span-2 ml-auto" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">邮箱</FormLabel>
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
                className="flex gap-2 items-center"
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
