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
import { createSellProduct } from "../api/sell_stock_admin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFetchOption } from "@/hooks/use-fetch-option";
import { fetchSupplierOptions } from "@/views/supplier/api/supplier";
import DataSelector from "@/components/custom/data-selector";
import { SELLABLE_ITEM_CATEGORIES } from "@/lib/constants";
import { CategorySelector } from "./category_selector";

interface CreateSellableItemProps {
  onSuccess?: () => void;
}

export const CreateSellableItem = ({ onSuccess }: CreateSellableItemProps) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [keepOpenAndClear, setKeepOpenAndClear] = useState(false);

  const { data: suppliers, isLoading: supplierLoading } = useFetchOption(
    fetchSupplierOptions,
    open
  );

  const categories = useMemo(() => SELLABLE_ITEM_CATEGORIES, []);

  const form = useForm<SellStockForm>({
    resolver: zodResolver(SellStockData),
    defaultValues: {
      id: "",
      name: "",
      quantity: 0,
      category: "",
      supplier_name: "",
      purchase_price: 0,
      selling_price: 0,
      image_url: undefined,
    },
  });
  const {
    formState: { isSubmitting },
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
  } = form;
  const watchedImage = watch("image_url");

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

  const handleModalChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        reset();
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setKeepOpenAndClear(false);
      }
    },
    [reset]
  );

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
    let imageUrl: string | undefined = undefined;
    let uploadError = null;

    if (values.image_url instanceof File) {
      const file = values.image_url;
      const filePath = `public/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("products")
        .upload(filePath, file, { upsert: true }); // Use a generic bucket or 'sellable_items'
      if (error) {
        uploadError = error;
      } else {
        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);
        imageUrl = urlData?.publicUrl;
      }
    }

    if (uploadError) {
      toast.error(`图片上传失败: ${uploadError.message}`);
      return;
    }

    const apiData = { ...values, image_url: imageUrl };

    try {
      const result = await createSellProduct(apiData);
      if (result.status == "success") {
        toast.success(result.msg || "可售配件添加成功！");
        onSuccess?.();

        if (keepOpenAndClear) {
          if (fileInputRef.current) fileInputRef.current.value = "";
          setPreviewUrl(null);
          reset(); // Clear form for next entry
          // Optionally focus the first field
          form.setFocus("id");
        } else {
          handleModalChange(false); // Close modal
        }
      } else {
        toast.error(result.msg || "添加失败。");
      }
    } catch (error: any) {
      toast.error(`操作失败: ${error.message || "未知错误"}`);
    }
  };

  const handleIdInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault(); // **阻止回车键的默认行为 (触发表单提交)**

      form.setFocus("name");
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新增可售配件
        </Button>
      }
      title="添加新的可售配件"
      dialogClassName="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
      showMobileFooter={false}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Image Upload and Preview */}
            <div className="md:col-span-1 space-y-4">
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  商品图片 (可选)
                </FormLabel>
                <div className="flex flex-col items-center gap-3 p-4 border rounded-md bg-muted/30">
                  <Avatar className="h-40 w-40 rounded-lg border bg-background shadow-sm">
                    {/* Larger Avatar */}
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
                      <Upload className="mr-2 size-4" /> 选择图片
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

            {/* Right Column: Form Fields, make it scrollable */}
            <div className="md:col-span-2">
              <div className="h-[calc(50vh-120px)] pr-3 md:h-[60vh] overflow-y-auto">
                <div className="space-y-4 p-1">
                  <FormField
                    control={control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品ID (条码/编号) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="唯一ID，例如扫描条码"
                            onKeyDown={handleIdInputKeyDown}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>商品名称 *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="例如: iPhone 12 钢化膜 (高清)"
                            {...field}
                            disabled={isSubmitting}
                          />
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
                          <FormLabel>分类 *</FormLabel>
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
                          <FormLabel>供应商 *</FormLabel>
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
                          <FormLabel>初始库存数量 *</FormLabel>
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
                          <FormLabel>进价 (€) (可选)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
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
              </div>
            </div>
          </div>

          {/* Form Actions and "Continue Adding" Checkbox */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t mt-4">
            <div className="flex items-center space-x-2 order-last sm:order-first">
              <Checkbox
                id="keepOpen"
                checked={keepOpenAndClear}
                onCheckedChange={(checked) =>
                  setKeepOpenAndClear(Boolean(checked))
                }
                disabled={isSubmitting}
              />
              <Label
                htmlFor="keepOpen"
                className="text-sm font-medium cursor-pointer text-muted-foreground"
              >
                创建后继续添加
              </Label>
            </div>
            <div className="flex gap-3">
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
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <Loader className="mr-2 size-4 animate-spin" />
                ) : null}
                添加商品
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
