"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader, PlusIcon, ImageIcon, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SellStockData, SellStockForm } from "../schema/sell.schema";
import type { SellStock } from "@/lib/types";
import { updateSellProduct } from "../api/sell_stock_admin";
import { ScrollArea } from "@/components/ui/scroll-area";
import DataSelector from "@/components/custom/data-selector";
import { useFetchOption } from "@/hooks/use-fetch-option";
import { fetchSupplierOptions } from "@/views/supplier/api/supplier";
import { SELLABLE_ITEM_CATEGORIES } from "@/lib/constants";
import { CategorySelector } from "./category_selector";

interface EditSellableItemProps {
  item: SellStock; // Initial item data
  triggerButton: React.ReactNode;
  onSuccess?: () => void;
}

export const EditSellableItem = ({
  item,
  triggerButton,
  onSuccess,
}: EditSellableItemProps) => {
  const [open, setOpen] = useState(false);
  // Store the initial image URL to compare if it changed
  const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>(
    item?.image_url ?? undefined
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const categories = useMemo(() => SELLABLE_ITEM_CATEGORIES, []);

  const {
    data: suppliers,
    isLoading: supplierLoading,
    error: supplierError,
  } = useFetchOption(fetchSupplierOptions, open);

  const form = useForm<SellStockForm>({
    resolver: zodResolver(SellStockData),
    defaultValues: {
      id: item?.id ?? "", // ID is usually not editable
      name: item?.name ?? "",
      quantity: item?.quantity ?? 0,
      category: item?.category ?? "",
      supplier_name: item?.supplier_name ?? "",
      purchase_price: item?.purchase_price ?? 0,
      selling_price: item?.selling_price ?? 0,
      image_url: initialImageUrl, // Initialize with URL string or undefined
    },
  });
  const {
    formState: { isSubmitting, isDirty },
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
  } = form;
  const watchedImage = watch("image_url");

  // Effect to update preview when watchedImage changes
  useEffect(() => {
    let objectUrl: string | null = null;
    if (watchedImage instanceof File) {
      objectUrl = URL.createObjectURL(watchedImage);
      setPreviewUrl(objectUrl);
    } else if (typeof watchedImage === "string" && watchedImage) {
      setPreviewUrl(watchedImage);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [watchedImage]);

  // Effect to reset form if external `item` prop changes or modal closes without saving
  useEffect(() => {
    const imageUrl = item?.image_url ?? undefined;
    if (item && !isSubmitting) {
      // Only reset if not submitting
      reset({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        category: item.category ?? "",
        supplier_name: item.supplier_name ?? "",
        purchase_price: item.purchase_price ?? 0,
        selling_price: item.selling_price,
        image_url: imageUrl,
      });
      setInitialImageUrl(imageUrl);
      setPreviewUrl(imageUrl ?? null);
    }
  }, [item, reset, isSubmitting, open]); // Depend on open to reset on modal close

  const handleModalChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    // Reset logic moved to useEffect above
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setValue("image_url", file, { shouldValidate: true, shouldDirty: true });
    }
    event.target.value = "";
  };
  const handleRemoveImage = () => {
    setValue("image_url", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: SellStockForm) => {
    if (!isDirty) {
      toast.info("内容没有变更。");
      handleModalChange(false);
      return;
    }

    let imageUrl: string | undefined = initialImageUrl;
    let uploadError = null;
    const imageChanged = values.image_url !== initialImageUrl;

    if (imageChanged) {
      if (values.image_url instanceof File) {
        const file = values.image_url;
        const filePath = `public/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("products")
          .upload(filePath, file, { upsert: true });
        if (error) {
          uploadError = error;
        } else {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);
          imageUrl = urlData?.publicUrl;
        }
      } else {
        // Image was removed or changed to empty string
        imageUrl = undefined; // Set to null to clear in DB
      }
    }

    if (uploadError) {
      toast.error(`图片上传失败: ${uploadError.message}`);
      return;
    }

    const apiData = { ...values, image_url: imageUrl };
    // ID should not be in the update payload for the `update` function data itself
    const { id: itemId, ...updatePayload } = apiData;

    try {
      const result = await updateSellProduct(item.id, updatePayload); // Use original item.id
      if (result.status == "success") {
        toast.success(result.msg || "商品更新成功！");
        handleModalChange(false);
        onSuccess?.();
      } else {
        toast.error(result.msg || "更新失败。");
      }
    } catch (error: any) {
      toast.error(`操作失败: ${error.message || "未知错误"}`);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={`修改可售配件: ${item.name}`}
      description={`ID: ${item.id}`}
      dialogClassName="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
      showMobileFooter={false}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
          {/* Main layout: Left for Image, Right for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Image */}
            <div className="md:col-span-1 space-y-4">
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  商品图片 (可选)
                </FormLabel>
                <div className="flex flex-col items-center gap-3 p-4 border rounded-md bg-muted/30">
                  <Avatar className="h-40 w-40 rounded-lg border bg-background shadow-sm">
                    {previewUrl ? (
                      <AvatarImage
                        src={previewUrl}
                        alt="预览"
                        className="object-contain rounded-lg"
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        <ImageIcon className="size-12 text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSubmitting}
                      className="w-full"
                      tabIndex={-1}
                    >
                      <Upload className="mr-2 size-4" /> 更改图片
                    </Button>
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={handleRemoveImage}
                        disabled={isSubmitting}
                        tabIndex={-1}
                      >
                        <X className="mr-2 size-4" /> 移除图片
                      </Button>
                    )}
                  </div>
                  <FormDescription className="text-xs text-center">
                    Max 5MB. JPG, PNG, SVG, WebP.
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.svg,.webp"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-center">
                    {form.formState.errors.image_url?.message?.toString()}
                  </FormMessage>
                </div>
              </FormItem>
            </div>
            {/* Right Column: Form Fields */}
            <div className="md:col-span-2">
              <div className="h-[calc(50vh-120px)] pr-3 md:h-[60vh] overflow-y-auto">
                <div className="space-y-4 p-1">
                  <FormField
                    control={control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品ID (不可修改)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            disabled
                            className="bg-muted/50 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品名称 *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>分类</FormLabel>
                          <CategorySelector
                            categories={categories}
                            fieldName="category"
                            selectedValue={field.value}
                            setValue={setValue}
                            disabled={isSubmitting}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="supplier_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>供应商</FormLabel>
                          <DataSelector
                            options={suppliers}
                            selectedValue={field.value}
                            setValue={setValue}
                            fieldName="supplier_name"
                            isLocked={supplierLoading}
                            disabled={isSubmitting || supplierLoading}
                            placeholder="选择供应商"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>库存 *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
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
                      name="purchase_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>进价 (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              value={field.value ?? ""}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name="selling_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>零售价 (€) *</FormLabel>
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
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t mt-4">
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
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : null}
              保存修改
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
