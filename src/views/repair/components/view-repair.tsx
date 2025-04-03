"use client";

import { RepairWithCustomer } from "@/lib/types";

import { useMemo, useState } from "react";
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
import date from "@/lib/date";
import { Card, CardContent } from "@/components/ui/card";

interface ViewRepairProps {
  repair: RepairWithCustomer;
}

export const ViewRepair = ({ repair }: ViewRepairProps) => {
  const [open, setOpen] = useState(false);

  // Memoize computed values
  const formattedDate = useMemo(
    () => date(repair.createdAt).format("DD/MM/YYYY"),
    [repair.createdAt]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 transition-all hover:bg-accent"
        >
          <Eye className="size-4" />
          详情
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>维修ID: {repair.id} 详情</SheetTitle>
          <SheetDescription>手机型号: {repair.phone}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col mt-4 space-y-2">
          {repair.customers && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">客人信息</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField label="客人名称">
                    {repair.customers.name}
                  </InputField>
                  <InputField label="联系方式">
                    {repair.customers.tel}
                  </InputField>
                  <InputField label="邮箱">
                    {repair.customers.email || (
                      <span className="text-muted-foreground italic">
                        没有提供邮箱
                      </span>
                    )}
                  </InputField>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">手机信息</h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 gap-3">
                <InputField label="手机型号">{repair.phone}</InputField>
                <InputField label="维修状态">
                  <Badge
                    className={
                      repair.status === "已修复"
                        ? "bg-green-100 text-green-800"
                        : repair.status === "修理中"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {repair.status}
                  </Badge>
                </InputField>
                <InputField label="维修故障">
                  <div className="flex flex-wrap gap-2">
                    {repair.problem?.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="animate-fadeIn"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </InputField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">订单信息</h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label="订金">
                  <span className="font-medium">{toEUR(repair.deposit)}</span>
                </InputField>
                <InputField label="价格">
                  <span className="font-medium">{toEUR(repair.price)}</span>
                </InputField>
                <InputField label="创建日期">{formattedDate}</InputField>
                <InputField label="应收">
                  <span className="font-medium text-green-600">
                    {toEUR(repair.price - repair.deposit)}
                  </span>
                </InputField>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
