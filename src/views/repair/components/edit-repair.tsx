"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

import { Loader } from "lucide-react";
import { fetchCustomersForCreateRepair } from "@/views/customer/api/customer";
import { toast } from "sonner";
import { updateRepair } from "@/views/repair/api/repair";
import { CustomerSelector } from "@/views/repair/components/customer-selector";
import { fetchProblemsForCreateComponent } from "@/views/category/api/problem";
import { RepairWithCustomer } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveModal } from "@/components/custom/responsive-modal";

interface EditRepairProps {
  repair: RepairWithCustomer;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}
export const EditRepair = ({
  repair,
  triggerButton,
  onSuccess,
}: EditRepairProps) => {
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

  // Memoize default values to prevent unnecessary rerenders
  const defaultValues = useMemo<RepairForm>(
    () => ({
      customerId: repair?.customerId ?? null,
      phone: repair?.phone ?? "",
      problem: repair?.problem ?? [],
      status: (repair?.status as RepairStatus) ?? RepairStatus.PENDING, // Cast needed? Ensure type match
      deposit: repair?.deposit ?? 0,
      price: repair?.price ?? 0,
    }),
    [repair]
  );

  const form = useForm<RepairForm>({
    resolver: zodResolver(repairFormSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting, isDirty },
    reset,
    control,
    setValue,
  } = form;

  // Reset form when repair prop changes or modal closes without save
  useEffect(() => {
    if (repair && !isSubmitting) {
      reset(defaultValues); // Reset using memoized defaults
    }
  }, [repair, defaultValues, reset, isSubmitting, open]);

  const handleModalChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    // Reset logic moved to useEffect
  }, []);

  const onSubmit = async (values: RepairForm) => {
    if (!isDirty) {
      toast.info("内容没有变更。");
      handleModalChange(false);
      return;
    }
    const dataToSend = {
      // Ensure types before sending
      ...values,
      customerId: values.customerId ? Number(values.customerId) : null,
      deposit: Number(values.deposit || 0),
      price: Number(values.price || 0),
    };

    try {
      const { msg, status } = await updateRepair(dataToSend, repair.id, repair); // Pass original for comparison if needed by API
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false);
        onSuccess?.();
      } else {
        toast.error(msg || "更新失败。");
      }
    } catch (error: any) {
      toast.error(`更新失败: ${error.message || "请稍后重试"}`);
      console.error("Update repair error:", error);
    }
  };

  const handleCustomerListRefresh = useCallback(() => {
    if (refetchCustomers) {
      refetchCustomers(); // Call the refetch function from the hook
    }
  }, [refetchCustomers]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={`修改维修单: #${repair.id}`}
      description={`客户: ${repair.customers?.name ?? "未知"}, 手机: ${
        repair.phone
      }`}
      dialogClassName="sm:max-w-lg"
      showMobileFooter={false}
    >
      <Form {...form}>
        {/* Use similar layout as Create Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-h-[75vh] overflow-y-auto p-1 pr-2"
        >
          {/* Grid for form fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Status */}
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
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
                      {/* Allow selection of all statuses when editing */}
                      {Object.values(RepairStatus).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Customer */}
            <FormField
              control={control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>客户 *</FormLabel>
                  {customerLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <CustomerSelector
                      options={customers}
                      selectedValue={field.value}
                      setValue={setValue}
                      fieldName="customerId"
                      isLoading={customerLoading}
                      disabled={isSubmitting}
                      onCustomerListChange={handleCustomerListRefresh}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone */}
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机型号 *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Problem */}
            <FormField
              control={control}
              name="problem"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
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
            {/* Deposit */}
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
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>维修总价 (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
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
              disabled={isSubmitting || !isDirty}
              className="min-w-[100px]"
            >
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              保存修改
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
