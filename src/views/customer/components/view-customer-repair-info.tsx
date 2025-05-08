"use client";

import type { RepairInfo } from "@/lib/types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { Eye, Loader, AlertTriangle, ShoppingBasket } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toEUR } from "@/lib/utils";
import date from "@/lib/date";
import { fetchRepairInfo } from "../api/customer"; // Adjust path
import { ScrollArea } from "@/components/ui/scroll-area";

const RepairInfoTable = ({ repairs }: { repairs: RepairInfo[] }) => {
  const totalAmount = useMemo(
    () =>
      // Memoize calculation
      repairs?.reduce((total, repair) => (total += repair.price || 0), 0) || 0,
    [repairs]
  );

  return (
    <Table>
      {/* Only show caption if there are repairs */}
      {repairs.length > 0 && (
        <TableCaption className="mt-4">
          共计 {repairs.length} 条维修记录, 总消费 {toEUR(totalAmount)}
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">手机型号</TableHead>
          <TableHead>维修故障</TableHead>
          <TableHead className="whitespace-nowrap">完成日期</TableHead>
          <TableHead className="text-right whitespace-nowrap">金额</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Handle empty state within table body */}
        {repairs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              <ShoppingBasket className="mx-auto mb-2 size-8" />
              没有找到相关维修记录
            </TableCell>
          </TableRow>
        ) : (
          repairs.map((repair) => (
            <TableRow key={repair.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {repair.phone || "-"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {repair.problem?.join(", ") || "-"}
              </TableCell>{" "}
              {/* Join problems */}
              <TableCell className="text-xs whitespace-nowrap">
                {repair.updatedAt
                  ? date(repair.updatedAt).format("YYYY-MM-DD")
                  : "-"}{" "}
                {/* Use standard format */}
              </TableCell>
              <TableCell className="text-right font-semibold whitespace-nowrap">
                {toEUR(repair.price)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

interface ViewCustomerRepairInfoProps {
  customerId: number; // Pass ID instead of name for fetching
  customerName: string; // Keep name for title
  triggerButton: React.ReactNode;
}

export const ViewCustomerRepairInfo = ({
  customerId,
  customerName,
  triggerButton,
}: ViewCustomerRepairInfoProps) => {
  const [open, setOpen] = useState(false);
  const [repairInfo, setRepairInfo] = useState<RepairInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when modal opens
  const loadRepairInfo = useCallback(async () => {
    if (!open || repairInfo !== null || isLoading) return; // Fetch only once when opened, if not already loading/loaded

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRepairInfo(customerId);
      setRepairInfo(data ?? []); // Set to empty array if data is null/undefined
    } catch (err) {
      console.error("Failed to fetch repair info:", err);
      setError("无法加载维修记录，请稍后重试。");
      setRepairInfo([]); // Set empty on error
    } finally {
      setIsLoading(false);
    }
  }, [open, customerId, repairInfo, isLoading]);

  // Trigger fetch when modal opens
  useEffect(() => {
    if (open) {
      loadRepairInfo();
    } else {
      // Optionally reset state when modal closes
      setRepairInfo(null);
      setError(null);
    }
  }, [open, loadRepairInfo]);

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-10 text-muted-foreground">
          <Loader className="mr-2 size-5 animate-spin" /> 加载中...
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-destructive text-center">
          <AlertTriangle className="size-6 mb-2" />
          <p className="font-medium mb-1">加载失败</p>
          <p className="text-sm mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadRepairInfo}>
            重试
          </Button>
        </div>
      );
    }
    // Pass RepairInfoTable the fetched data (guaranteed to be array or empty array now)
    return <RepairInfoTable repairs={repairInfo ?? []} />;
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange} // Use handleModalChange
      dialogClassName="sm:max-w-lg" // Use the className prop
      triggerButton={triggerButton} // Use passed trigger
      title={`${customerName} 的维修记录`}
      showMobileFooter={true}
    >
      <ScrollArea className="max-h-[60vh] pr-1">
        {/* Adjust max height */}
        {renderContent()}
      </ScrollArea>
    </ResponsiveModal>
  );
};
