"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  componentSchema,
  ComponentSchema,
  Qualities,
} from "@/views/component/schema/component.schema";

import { Component } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Loader, Edit } from "lucide-react";

interface EditComponentProps {
  component: Component;
}

export const EditComponent = ({ component }: EditComponentProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: brands, isLoading: brandFieldLocker } = useFetchOptionData(
    fetchBrandsForCreateComponent,
    open
  );
  const { data: categories, isLoading: categoryFieldLocker } =
    useFetchOptionData(fetchCategoryForCreateComponent, open);
  const { data: suppliers, isLoading: supplierFieldLocker } =
    useFetchOptionData(fetchSuppliersForCreateComponent, open);

  const form = useForm<ComponentSchema>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      code: component.code ?? "",
      name: component.name,
      alias: component.alias ?? "",
      brand: component.brand,
      model: component.model ?? [],
      category: component.category,
      quality: component.quality,
      supplier: component.supplier,
      stock: component.stock,
      purchase_price: component.purchase_price,
      public_price: component.public_price,
    },
  });

  const {
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: ComponentSchema) => {
    const { msg, status } = await updateComponent(values, component.id);

    if (status === "success") {
      toast.success(msg);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(msg);
    }
  };

  const watchedBrand = useWatch({
    control,
    name: "brand",
  });

  const phones = useFetchPhonesByBrand(watchedBrand);

  useEffect(() => {
    form.reset({
      code: component.code ?? "",
      name: component.name,
      alias: component.alias ?? "",
      brand: component.brand,
      model: component.model ?? [],
      category: component.category,
      quality: component.quality,
      supplier: component.supplier,
      stock: component.stock,
      purchase_price: component.purchase_price,
      public_price: component.public_price,
    });
  }, [component]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Edit className="size-4" /> 修改
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="min-w-full max-h-[75%] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>修改配件信息</SheetTitle>
          <SheetDescription>
            配件ID: {component.id} 配件名称: {component.name}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 py-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="grid order-1 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">配件编号</FormLabel>
                    <div className="col-span-3">
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
                name="name"
                render={({ field }) => (
                  <FormItem className="grid order-2 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">配件名称</FormLabel>
                    <div className="col-span-3">
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
                name="alias"
                render={({ field }) => (
                  <FormItem className="grid order-3 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">配件别名</FormLabel>
                    <div className="col-span-3">
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
                name="brand"
                render={({ field }) => (
                  <FormItem className="grid order-5 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">适用品牌</FormLabel>
                    <div className="col-span-3">
                      <DataSelector
                        options={brands}
                        selectedValue={field.value}
                        setValue={form.setValue}
                        fieldName="brand"
                        isLocked={brandFieldLocker}
                        disabled={isSubmitting}
                        placeholder="选择适用的品牌"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="grid order-6 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">适用型号</FormLabel>
                    <div className="col-span-3">
                      <MultiSelector
                        options={phones}
                        selectedValues={field.value}
                        onChange={field.onChange}
                        placeholder="选择适用型号"
                        disabled={!watchedBrand || isSubmitting}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="grid order-4 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">分类</FormLabel>
                    <div className="col-span-3">
                      <DataSelector
                        options={categories}
                        selectedValue={field.value}
                        setValue={form.setValue}
                        fieldName="category"
                        isLocked={categoryFieldLocker}
                        disabled={isSubmitting}
                        placeholder="选择分类"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem className="grid order-7 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">供应商</FormLabel>
                    <div className="col-span-3">
                      <DataSelector
                        options={suppliers}
                        selectedValue={field.value}
                        setValue={form.setValue}
                        fieldName="supplier"
                        isLocked={supplierFieldLocker}
                        disabled={isSubmitting}
                        placeholder="选择供应商"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem className="grid order-7 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">配件品质</FormLabel>
                    <div className="col-span-3">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择配件品质" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Qualities).map((item) => (
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
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="grid order-8 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">库存数量</FormLabel>
                    <div className="col-span-3">
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
                name="purchase_price"
                render={({ field }) => (
                  <FormItem className="grid order-9 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">进价</FormLabel>
                    <div className="col-span-3">
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
                name="public_price"
                render={({ field }) => (
                  <FormItem className="grid order-10 grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">维修报价</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} disabled={isSubmitting} />
                      </FormControl>
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
                保存
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
