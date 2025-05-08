"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  componentSchema,
  ComponentSchema,
  Qualities,
} from "@/views/component/schema/component.schema";

import type { Component } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useFetchOptionData } from "@/views/component/hooks/use-fetch-data";
import { useFetchPhonesByBrand } from "@/views/component/hooks/use-fetch-phones";

import { fetchSuppliersForCreateComponent } from "@/views/supplier/api/supplier";
import { fetchCategoryForCreateComponent } from "@/views/category/api/component";
import { fetchBrandsForCreateComponent } from "@/views/brand/api/brand";
import { updateComponent } from "@/views/component/api/component";

import MultiSelector from "@/components/custom/multi-selector";
import DataSelector from "@/components/custom/data-selector";

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
import { Loader, AlertCircle } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EditComponentProps {
  component: Component;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const EditComponent = ({
  component,
  triggerButton,
  onSuccess,
}: EditComponentProps) => {
  const [open, setOpen] = useState(false);
  // Fetch options only when modal opens
  const {
    data: brands,
    isLoading: brandLoading,
    error: brandError,
  } = useFetchOptionData(fetchBrandsForCreateComponent, open);
  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
  } = useFetchOptionData(fetchCategoryForCreateComponent, open);
  const {
    data: suppliers,
    isLoading: supplierLoading,
    error: supplierError,
  } = useFetchOptionData(fetchSuppliersForCreateComponent, open);

  const form = useForm<ComponentSchema>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      code: component?.code ?? "",
      name: component?.name ?? "",
      alias: component?.alias ?? "",
      brand: component?.brand ?? undefined,
      model: component?.model ?? [],
      category: component?.category ?? undefined,
      quality: component?.quality ?? undefined,
      supplier: component?.supplier ?? undefined,
      stock: component?.stock ?? 0,
      purchase_price: component?.purchase_price ?? 0,
      public_price: component?.public_price ?? 0,
    },
  });

  const {
    formState: { isSubmitting, isDirty },
    control,
    setValue,
  } = form;

  // Watch brand for fetching phones
  const watchedBrand = useWatch({ control, name: "brand" });
  const {
    phones,
    isLoading: phonesLoading,
    error: phonesError,
  } = useFetchPhonesByBrand(watchedBrand);

  // Reset form when component prop changes or modal closes without saving
  useEffect(() => {
    if (component && !isSubmitting) {
      // Only reset if not submitting
      form.reset({
        code: component.code ?? "",
        name: component.name ?? "",
        alias: component.alias ?? "",
        brand: component.brand ?? undefined,
        model: component.model ?? [],
        category: component.category ?? undefined,
        quality: component.quality ?? undefined,
        supplier: component.supplier ?? undefined,
        stock: component.stock ?? 0,
        purchase_price: component.purchase_price ?? 0,
        public_price: component.public_price ?? 0,
      });
    }
  }, [component, form.reset, isSubmitting, open]);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // No reset here, useEffect handles it based on 'open' state
  };

  const onSubmit = async (values: ComponentSchema) => {
    if (!isDirty) {
      handleModalChange(false);
      return;
    }
    const dataToSend = {
      // Ensure numeric types
      ...values,
      stock: Number(values.stock || 0),
      purchase_price: Number(values.purchase_price || 0),
      public_price: Number(values.public_price || 0),
    };

    try {
      const { msg, status } = await updateComponent(dataToSend, component.id);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false);
        onSuccess?.();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("更新配件失败，请稍后重试。");
      console.error("Update component error:", error);
    }
  };

  const qualityOptions = useMemo(() => Object.values(Qualities), []);
  const fetchErrors = [
    brandError,
    categoryError,
    supplierError,
    phonesError,
  ].filter(Boolean);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton} // Use passed trigger
      title={`修改配件: ${component?.name}`}
      description={`ID: ${component?.id}`}
      dialogClassName="sm:max-w-2xl"
      showMobileFooter={false} // Disable default footer
    >
      <Form {...form}>
        {fetchErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>
              无法加载部分选项：{fetchErrors.join("; ")}
            </AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 pb-2"
        >
          {/* Form Grid - same structure as Create */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 px-1">
            {/* Code */}
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件编号 *</FormLabel>{" "}
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件名称 *</FormLabel>{" "}
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Category */}
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>分类 *</FormLabel>
                  <DataSelector
                    options={categories}
                    selectedValue={field.value}
                    setValue={setValue}
                    fieldName="category"
                    isLocked={categoryLoading}
                    disabled={isSubmitting || categoryLoading}
                    placeholder="选择分类"
                  />
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Brand */}
            <FormField
              control={control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>适用品牌 *</FormLabel>
                  <DataSelector
                    options={brands}
                    selectedValue={field.value}
                    setValue={setValue}
                    fieldName="brand"
                    isLocked={brandLoading}
                    disabled={isSubmitting || brandLoading}
                    placeholder="选择品牌"
                  />
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Model */}
            <FormField
              control={control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>适用型号 *</FormLabel>
                  <MultiSelector
                    options={phones}
                    selectedValues={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="选择型号"
                    disabled={!watchedBrand || phonesLoading || isSubmitting}
                    isLoading={phonesLoading}
                  />
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Quality */}
            <FormField
              control={control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件品质 *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择品质" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {qualityOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Supplier */}
            <FormField
              control={control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>供应商 *</FormLabel>
                  <DataSelector
                    options={suppliers}
                    selectedValue={field.value}
                    setValue={setValue}
                    fieldName="supplier"
                    isLocked={supplierLoading}
                    disabled={isSubmitting || supplierLoading}
                    placeholder="选择供应商"
                  />
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Stock */}
            <FormField
              control={control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>库存数量 *</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Purchase Price */}
            <FormField
              control={control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>采购价格 (€) *</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />

            {/* Public Price */}
            <FormField
              control={control}
              name="public_price"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>建议维修报价 (€) (可选)</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            {/* Alias */}
            <FormField
              control={control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件别名 (可选)</FormLabel>{" "}
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
          </div>
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 pr-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleModalChange(false)}
              disabled={isSubmitting}
            >
              {" "}
              取消{" "}
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
