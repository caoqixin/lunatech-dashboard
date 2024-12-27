"use client";

import { RepairWithCustomer } from "@/lib/types";

import { useState } from "react";
import { Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { InputField } from "@/components/custom/input-field";
import { toEUR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";

interface ViewRepairProps {
  repair: RepairWithCustomer;
}

export const ViewRepair = ({ repair }: ViewRepairProps) => {
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
          <SheetTitle>维修ID: {repair.id} 详情</SheetTitle>
          <SheetDescription>手机型号: {repair.phone}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col mt-2 space-y-2">
          {repair.customers && (
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xl">客人信息:</span>
              <Separator />
              <div className="flex flex-col mt-2 space-y-2">
                <InputField label="客人名称">
                  {repair.customers.name}
                </InputField>
                <InputField label="联系方式">{repair.customers.tel}</InputField>
                <InputField label="邮箱">
                  {repair.customers.email
                    ? repair.customers.email
                    : "没有提供邮箱"}
                </InputField>
              </div>
            </div>
          )}
          <div className="flex flex-col mt-2">
            <span className="text-muted-foreground text-xl">手机信息:</span>
            <Separator />
          </div>
          <InputField label="手机型号">{repair.phone}</InputField>
          <InputField label="维修故障">
            <div className="flex gap-2">
              {repair.problem?.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </InputField>
          <InputField label="维修状态">{repair.status}</InputField>
          <InputField label="订金">{toEUR(repair.deposit)}</InputField>
          <InputField label="价格">{toEUR(repair.price)}</InputField>
          <InputField label="创建日期">
            {dayjs(repair.createdAt).format("DD/MM/YYYY")}
          </InputField>
        </div>
      </SheetContent>
    </Sheet>
  );
};
