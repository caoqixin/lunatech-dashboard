"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { exportAllCustomers } from "@/views/customer/api/customer";
import { convertCSVtoVCF } from "@/lib/utils";

interface ExportCustomerButtonProps {
  customerCounts: number;
}

export const ExportCustomerButton = ({
  customerCounts,
}: ExportCustomerButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleConfirm = async () => {
    setIsExporting(true);
    try {
      const data = await exportAllCustomers();

      const vcfData = convertCSVtoVCF(data);

      // 创建 Blob 对象并触发下载
      const blob = new Blob([vcfData], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "customers.vcf";
      link.click();

      // 释放 URL
      URL.revokeObjectURL(url);

      toast.success("导出成功!");
    } catch (error) {
      toast.warning("导出失败, 请重试");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ResponsiveModal
      title="导出客户资料"
      open={open}
      onOpen={setOpen}
      triggerButton={
        <Button className="text-xs md:text-sm" variant="secondary">
          <DatabaseBackup className="mr-2 h-4 w-4" /> 导出
        </Button>
      }
    >
      <div className="mx-4 py-4">
        总计有 {customerCounts} 位客户信息, 确定要导出吗?
      </div>
      <Button
        className="mx-4 flex gap-2"
        disabled={isExporting}
        onClick={handleConfirm}
      >
        {isExporting ? (
          <>
            <Loader className="size-6 animate-spin" /> 正在导出
          </>
        ) : (
          "确认"
        )}
      </Button>
    </ResponsiveModal>
  );
};
