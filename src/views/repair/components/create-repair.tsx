"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useFetchCustomers } from "@/views/repair/hooks/use-fetch-customers";
import { useFetchProblems } from "@/views/repair/hooks/use-fetch-problems";

import {
  RepairForm,
  repairFormSchema,
  RepairStatus,
} from "@/views/repair/schema/repair.schema";

import MultiSelector from "@/components/custom/multi-selector";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Loader, PlusIcon } from "lucide-react";
import { fetchCustomersForCreateRepair } from "@/views/customer/api/customer";
import { toast } from "sonner";
import { createNewRepair } from "@/views/repair/api/repair";
import { CustomerSelector } from "@/views/repair/components/customer-selector";
import { fetchProblemsForCreateComponent } from "@/views/category/api/problem";

export const CreateRepair = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: customers, isLoading: customerLoading } = useFetchCustomers(
    fetchCustomersForCreateRepair,
    open
  );
  const { data: problems, isLoading: problemLoading } = useFetchProblems(
    fetchProblemsForCreateComponent,
    open
  );

  const form = useForm<RepairForm>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      phone: "",
      problem: [],
      status: RepairStatus.PENDING,
      deposit: 0,
      price: 0,
      customerId: null,
    },
  });

  const {
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = useCallback(
    async (values: RepairForm) => {
      const { msg, status } = await createNewRepair(values);

      if (status === "success") {
        toast.success(msg);
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(msg);
      }
    },
    [router, reset]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="text-xs md:text-sm">
          <PlusIcon className="mr-2 h-4 w-4" /> 维修
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="min-w-full max-h-[75%] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>创建维修</SheetTitle>
          <SheetDescription>创建维修</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 py-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="grid col-span-2 grid-cols-6 items-center gap-4">
                    <FormLabel className="text-right">客户</FormLabel>
                    <div className="col-span-5">
                      <FormControl>
                        <CustomerSelector
                          options={customers}
                          selectedValue={field.value}
                          setValue={form.setValue}
                          fieldName="customerId"
                          isLoading={customerLoading}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-4">
                    <FormLabel className="text-right">手机型号</FormLabel>
                    <div className="col-span-2">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isSubmitting}
                          placeholder="手机型号"
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-4">
                    <FormLabel className="text-right">维修故障</FormLabel>
                    <div className="col-span-2">
                      <MultiSelector
                        options={problems}
                        selectedValues={field.value}
                        onChange={field.onChange}
                        placeholder="选择维修故障"
                        disabled={problemLoading || isSubmitting}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-4">
                    <FormLabel className="text-right">维修订金 €:</FormLabel>
                    <div className="col-span-2">
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
                name="price"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-4">
                    <FormLabel className="text-right">维修金额 €:</FormLabel>
                    <div className="col-span-2">
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
                name="status"
                render={({ field }) => (
                  <FormItem className="grid col-span-2 grid-cols-6 items-center gap-4">
                    <FormLabel className="text-right">维修状态</FormLabel>
                    <div className="col-span-5">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择维修状态" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values([
                            RepairStatus.PENDING,
                            RepairStatus.REPAIRING,
                            RepairStatus.REPAIRED,
                          ]).map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  关闭
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex gap-2 items-center"
              >
                {isSubmitting && <Loader className="size-4 animate-spin" />}
                创建
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
