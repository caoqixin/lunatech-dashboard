"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  componentSchema,
  ComponentSchema,
  Qualities,
} from "@/views/component/schema/component.schema";

import { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useFetchOptionData } from "@/views/component/hooks/use-fetch-data";
import { useFetchPhonesByBrand } from "@/views/component/hooks/use-fetch-phones";

import { fetchSuppliersForCreateComponent } from "@/views/supplier/api/supplier";
import { fetchCategoryForCreateComponent } from "@/views/category/api/component";
import { fetchBrandsForCreateComponent } from "@/views/brand/api/brand";
import { createNewComponent } from "@/views/component/api/component";

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

import { Loader, PlusIcon, AlertCircle } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CreateComponentProps {
  onSuccess?: () => void;
}

export const CreateComponent = ({ onSuccess }: CreateComponentProps) => {
  const [open, setOpen] = useState(false);

  // 数据获取
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
      code: "",
      name: "",
      alias: "",
      brand: "",
      model: [],
      category: undefined,
      quality: undefined,
      supplier: undefined,
      stock: 0,
      purchase_price: 0,
      public_price: 0,
    },
  });

  const {
    formState: { isSubmitting },
    control,
    setValue,
  } = form;

  const watchedBrand = useWatch({
    control,
    name: "brand",
  });

  const {
    phones,
    isLoading: phonesLoading,
    error: phonesError,
  } = useFetchPhonesByBrand(watchedBrand);

  // Memoize quality options
  const qualityOptions = useMemo(() => Object.values(Qualities), []);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset(); // Reset form on close
    }
  };

  const onSubmit = async (values: ComponentSchema) => {
    // Convert prices/stock back to numbers if needed, although coerce should handle it
    const dataToSend = {
      ...values,
      stock: Number(values.stock || 0),
      purchase_price: Number(values.purchase_price || 0),
      public_price: Number(values.public_price || 0),
    };

    try {
      const { msg, status } = await createNewComponent(dataToSend);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false);
        onSuccess?.();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("创建配件失败，请稍后重试。");
      console.error("Create component error:", error);
    }
  };

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
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新增配件
        </Button>
      }
      title="新增配件记录"
      description="填写配件的详细信息。"
      dialogClassName="sm:max-w-2xl" // Wider modal for more fields
      showMobileFooter={false} // Disable default footer, use form buttons
    >
      <Form {...form}>
        {/* Show fetch errors at the top */}
        {fetchErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>
              无法加载部分选项：{fetchErrors.join("; ")}
            </AlertDescription>
          </Alert>
        )}
        {/* Scrollable Form Area for smaller screens / many fields */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 pb-2"
        >
          {/* Use a 2-column grid layout */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 px-1">
            {/* Required Fields First */}
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件编号 *</FormLabel>{" "}
                  <FormControl>
                    <Input
                      placeholder="扫描枪或手动输入"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件名称 *</FormLabel>{" "}
                  <FormControl>
                    <Input
                      placeholder="例如: iPhone 13 Pro Max 屏幕总成"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>{" "}
                  <FormMessage />{" "}
                </FormItem>
              )}
            />
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
            <FormField
              control={control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>
                    适用型号{" "}
                    {!watchedBrand && (
                      <span className="text-xs text-muted-foreground">
                        (请先选品牌)
                      </span>
                    )}{" "}
                    *
                  </FormLabel>
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
            <FormField
              control={control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  {" "}
                  <FormLabel>配件别名 (可选)</FormLabel>{" "}
                  <FormControl>
                    <Input
                      placeholder="方便搜索的别名"
                      {...field}
                      disabled={isSubmitting}
                    />
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
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              添加配件
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
