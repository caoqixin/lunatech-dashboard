"use client";

import { Button } from "@/components/ui/button";
import { Component } from "@/lib/types";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InputField } from "@/components/custom/input-field";
import { toEUR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ViewComponentProps {
  component: Component;
}

export const ViewComponent = ({ component }: ViewComponentProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="size-4" />
          详情
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{component.name}</SheetTitle>
          <SheetDescription>配件详情</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col mt-2 space-y-2">
          {component.code && (
            <InputField label="编号">{component.code}</InputField>
          )}
          <InputField label="名称">{component.name}</InputField>
          {component.alias && (
            <InputField label="别名">{component.alias}</InputField>
          )}
          <InputField label="适用品牌">{component.brand}</InputField>
          <InputField label="适配机型">
            <div className="flex w-full flex-wrap gap-2">
              {component.model?.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </InputField>
          <InputField label="分类">{component.category}</InputField>
          <InputField label="品质">{component.quality}</InputField>
          <InputField label="供应商">{component.supplier}</InputField>
          <InputField label="库存数量">{component.stock}</InputField>
          <InputField label="维修报价">
            {toEUR(component.public_price)}
          </InputField>
          <InputField label="成本价">
            {toEUR(component.purchase_price)}
          </InputField>
        </div>
      </SheetContent>
    </Sheet>
  );
};
