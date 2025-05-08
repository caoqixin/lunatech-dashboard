"use client";

import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Loader, Download, AlertTriangle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const csvData = await exportAllCustomers();
      if (!csvData) {
        throw new Error("未获取到导出数据。"); // Handle empty data case
      }

      const vcfData = convertCSVtoVCF(csvData);
      if (!vcfData) {
        throw new Error("数据转换失败或无有效数据。"); // Handle conversion failure
      }

      // 创建 Blob 对象并触发下载
      const blob = new Blob([vcfData], { type: "text/vcard;charset=utf-8" }); // Specify charset
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Generate filename with date
      const filename = `customers_${
        new Date().toISOString().split("T")[0]
      }.vcf`;
      link.download = filename;
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url); // Release memory

      toast.success("客户数据导出成功!");
      setOpen(false); // Close modal on success
    } catch (error) {
      console.error("Export failed:", error);
      const message =
        (error as Error).message || "导出失败，请检查网络或联系管理员。";
      setError(message); // Show error within the modal
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleModalChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setError(null); // Clear error on close
      setIsExporting(false); // Reset exporting state
    }
  };

  return (
    <ResponsiveModal
      title="导出客户资料"
      description={`将所有 ${customerCounts} 位客户信息导出为 VCF 文件。`} // Use description
      open={open}
      onOpenChange={handleModalChange} // Use handler
      triggerButton={
        <Button size="sm" variant="outline" className="text-xs md:text-sm">
          {" "}
          {/* Use outline */}
          <DatabaseBackup className="mr-1.5 h-4 w-4" /> 导出客户
        </Button>
      }
      dialogClassName="sm:max-w-sm" // Limit width
      showMobileFooter={false}
    >
      <div className="space-y-4 px-1">
        {/* Display confirmation or error */}
        {!error ? (
          <p className="text-sm text-muted-foreground">
            确定要导出全部 {customerCounts} 位客户信息吗？文件将以 VCF
            格式下载，可导入手机通讯录。
          </p>
        ) : (
          <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-3 text-destructive">
            <AlertTriangle className="size-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {/* Action button */}
        <Button
          className="w-full flex gap-2"
          disabled={isExporting}
          onClick={handleConfirm}
        >
          {isExporting ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          {isExporting ? "正在导出..." : "确认导出"}
        </Button>
      </div>
    </ResponsiveModal>
  );
};
