"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveModal } from "@/components/custom/responsive-modal";

interface CreateRepairProps {
  onSuccess?: () => void;
}
export const CreateRepair = ({ onSuccess }: CreateRepairProps) => {
  const [open, setOpen] = useState(false);
  const {
    data: customers,
    isLoading: customerLoading,
    refetch: refetchCustomers,
  } = useFetchCustomers(fetchCustomersForCreateRepair, open);
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
    control,
    setValue,
  } = form;

  const handleModalChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) reset(); // Reset form on close
    },
    [reset]
  );

  const onSubmit = useCallback(
    async (values: RepairForm) => {
      const dataToSend = {
        ...values,
        customerId: values.customerId ? Number(values.customerId) : null,
        deposit: Number(values.deposit || 0),
        price: Number(values.price || 0),
      };

      // Basic validation
      if (!dataToSend.customerId) {
        toast.error("请选择一个客户。");
        return;
      }

      try {
        const { msg, status } = await createNewRepair(dataToSend);
        if (status === "success") {
          toast.success(msg);
          handleModalChange(false); // Close modal
          onSuccess?.(); // Trigger parent refresh
        } else {
          toast.error(msg || "创建维修单失败。");
        }
      } catch (error) {
        toast.error(`创建失败: 请稍后重试"}`);
      }
    },
    [onSuccess, handleModalChange]
  );

  const handleCustomerListRefresh = useCallback(() => {
    if (refetchCustomers) {
      refetchCustomers(); // Call the refetch function from the hook
    }
  }, [refetchCustomers]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新建维修单
        </Button>
      }
      title="创建新的维修单"
      dialogClassName="sm:max-w-lg" // Wider for this form
      showMobileFooter={false} // Use form buttons
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-h-[75vh] overflow-y-auto p-1 pr-2"
        >
          {/* Customer Selector - Spans full width */}
          <FormField
            control={control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>选择客户 *</FormLabel>
                <CustomerSelector // Assuming this component is well-designed
                  options={customers}
                  selectedValue={field.value}
                  setValue={setValue}
                  fieldName="customerId"
                  isLoading={customerLoading}
                  disabled={isSubmitting}
                  onCustomerListChange={handleCustomerListRefresh}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 2-Column Grid for remaining fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机型号 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例如：iPhone 14 Pro"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>维修状态 *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(RepairStatus)
                        .filter(
                          (s) =>
                            s !== RepairStatus.TAKED &&
                            s !== RepairStatus.REPAIRED
                        )
                        .map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      {/* Allow initial subset */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="problem"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  {/* Span 2 cols */}
                  <FormLabel>维修故障 *</FormLabel>
                  {problemLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <MultiSelector
                      options={problems}
                      selectedValues={field.value}
                      onChange={field.onChange}
                      placeholder="选择维修故障"
                      disabled={isSubmitting}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>订金 (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>维修价 (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleModalChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              创建维修单
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
