"use client";

import { RepairWithCustomer } from "@/lib/types";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Euro,
  Eye,
  List,
  PhoneIcon,
  Smartphone,
  User,
  Wrench,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn, toEUR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import date from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RepairStatusBadge } from "./repair-status-badge";

interface ViewRepairProps {
  repair: RepairWithCustomer;
  triggerButton?: React.ReactNode;
}

// Reusable Detail Row Component
const DetailItem = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-start text-sm py-1.5">
    <div className="flex items-center gap-1.5 w-24 text-muted-foreground shrink-0">
      <Icon className="size-4" />
      <span>{label}</span>
    </div>
    <div className="flex-1 font-medium break-words">
      {children ?? (
        <span className="italic text-muted-foreground/70">未提供</span>
      )}
    </div>
  </div>
);

export const ViewRepair = ({ repair, triggerButton }: ViewRepairProps) => {
  const [open, setOpen] = useState(false);

  const createdAt = useMemo(
    () =>
      repair.createdAt ? date(repair.createdAt).format("DD/MM/YYYY") : "-",
    [repair.createdAt]
  );

  const updatedAt = useMemo(
    () =>
      repair.updatedAt ? date(repair.updatedAt).format("DD/MM/YYYY") : "-",
    [repair.updatedAt]
  );
  const amountDue = useMemo(
    () => (repair.price ?? 0) - (repair.deposit ?? 0),
    [repair.price, repair.deposit]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* Use provided trigger or default button */}
        {triggerButton ?? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 h-8"
          >
            <Eye className="size-4" /> 查看详情
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg w-full flex flex-col p-0">
        {" "}
        {/* Full width on mobile, larger on desktop */}
        <SheetHeader className="p-4 sm:p-6 border-b">
          <SheetTitle>维修单详情 (#{repair.id})</SheetTitle>
          <SheetDescription>查看维修单的详细信息。</SheetDescription>
        </SheetHeader>
        {/* Scrollable content area */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Customer Info Card */}
            {repair.customers ? (
              <Card>
                <CardHeader className="pb-2">
                  {" "}
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <User className="size-4" />
                    客户信息
                  </CardTitle>{" "}
                </CardHeader>
                <CardContent className="space-y-1 pt-2 text-sm">
                  <DetailItem label="姓名" icon={User}>
                    {repair.customers.name}
                  </DetailItem>
                  <DetailItem label="电话" icon={PhoneIcon}>
                    {repair.customers.tel}
                  </DetailItem>
                  <DetailItem label="邮箱" icon={Smartphone}>
                    {repair.customers.email}
                  </DetailItem>{" "}
                  {/* Assuming Smartphone icon or use Mail icon */}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="size-4" />
                    客户信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    未关联客户
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Repair Details Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Wrench className="size-4" />
                  维修详情
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-2 text-sm">
                <DetailItem label="手机型号" icon={PhoneIcon}>
                  {repair.phone}
                </DetailItem>
                <DetailItem label="状态" icon={List}>
                  <RepairStatusBadge status={repair.status} />
                </DetailItem>
                <DetailItem label="故障描述" icon={List}>
                  {repair.problem && repair.problem.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {repair.problem.map((p, i) => (
                        <Badge key={i} variant="secondary">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </DetailItem>
                <DetailItem label="创建时间" icon={Calendar}>
                  {createdAt}
                </DetailItem>
                <DetailItem label="最后更新" icon={Calendar}>
                  {updatedAt}
                </DetailItem>
                <DetailItem label="是否返修" icon={List}>
                  <Badge variant={repair.isRework ? "destructive" : "outline"}>
                    {repair.isRework ? "返修中" : "没有返修"}
                  </Badge>
                </DetailItem>
              </CardContent>
            </Card>

            {/* Financial Info Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Euro className="size-4" />
                  金额信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-2 text-sm">
                <DetailItem label="预估总价" icon={Euro}>
                  {toEUR(repair.price)}
                </DetailItem>
                <DetailItem label="已付订金" icon={Euro}>
                  {toEUR(repair.deposit)}
                </DetailItem>
                {!repair.isRework && ( // Only show amount due if not a rework? Adjust logic if needed
                  <DetailItem label="待付金额" icon={Euro}>
                    <span
                      className={cn(
                        "font-semibold",
                        amountDue > 0 && "text-green-600 dark:text-green-400"
                      )}
                    >
                      {toEUR(amountDue)}
                    </span>
                  </DetailItem>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
          <SheetClose asChild>
            <Button variant="outline">关闭</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
