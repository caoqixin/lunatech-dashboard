"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultiSelect, { Option } from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getPhoneByBrandName } from "@/lib/actions/server/get";
import {
  createComponent,
  updateComponent,
} from "@/lib/actions/server/repair_components";
import useBrand from "@/lib/fetcher/use-brand";
import { useComponentCategory } from "@/lib/fetcher/use-component-category";
import useSupplier from "@/lib/fetcher/use-supplier";
import { ComponentFormValue, ComponentSchema } from "@/schemas/componet-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface ComponentFormProps {
  initialData: any | null;
}

const qualities = [
  "compatibile",
  "originale",
  "hard oled compatibile",
  "soft oled compatibile",
  "incell",
  "service package original",
  "rigenerato",
];

export default function ComponentForm({ initialData }: ComponentFormProps) {
  if (initialData != null) {
    initialData.stock = initialData.stock.toString();
  }

  const defaultValues = initialData
    ? initialData
    : {
        code: "",
        name: "",
        alias: "",
        brand: "",
        model: [],
        quality: "",
        category: "",
        supplier: "",
        stock: "0",
        purchase_price: "0",
        public_price: "0",
      };

  const action = initialData ? "修改" : "创建";
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ComponentFormValue>({
    resolver: zodResolver(ComponentSchema),
    defaultValues,
  });

  const { brands } = useBrand();
  const { suppliers } = useSupplier();
  const { categories } = useComponentCategory("repair_category");

  const [phones, setPhones] = useState<Option[] | null>(null);

  const getPhonesByName = async (name: string) => {
    const data = await getPhoneByBrandName(name);

    if (data.length !== 0) {
      setPhones(data);
    } else {
      setPhones(null);
    }
  };
  const onBrandChange = async (value: string) => {
    form.setValue("brand", value);
    await getPhonesByName(value);
  };

  const onModelChange = (value: any, data: string[]) => {
    form.setValue(value, data);
  };

  const onSubmit = async (values: ComponentFormValue) => {
    startTransition(async () => {
      if (initialData === null) {
        const data = await createComponent(values);

        if (data.status === "success") {
          toast({
            title: data.msg,
          });
          router.push("/dashboard/components");
          form.reset();
        } else {
          toast({
            title: data.msg,
            variant: "destructive",
          });
        }
      } else {
        const data = await updateComponent(initialData.id, values);

        if (data.status === "success") {
          toast({
            title: data.msg,
          });
          router.push("/dashboard/components");
          form.reset();
        } else {
          toast({
            title: data.msg,
            variant: "destructive",
          });
        }
      }
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-1 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品条形码</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="商品条形码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配件名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="配件名称"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配件通用名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="配件通用名称"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品牌</FormLabel>
                  <Select
                    onValueChange={onBrandChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择品牌" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {brands &&
                          brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.name}>
                              {brand.name}
                            </SelectItem>
                          ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {phones && (
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>适配型号</FormLabel>
                    <MultiSelect
                      defaultValues={field.value}
                      placeholder="选择手机型号"
                      fieldName="model"
                      options={phones}
                      setField={onModelChange}
                      disabled={isPending}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {categories &&
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>供应商</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择供应商" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers &&
                        suppliers.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品质</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择品质" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {qualities.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>库存数量</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="number"
                      placeholder="库存数量"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>进价</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="进价" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>报价</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="报价" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            className="ml-auto flex gap-2 items-center"
            type="submit"
          >
            {isPending && <ReloadIcon className="animate-spin" />}
            {action}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
