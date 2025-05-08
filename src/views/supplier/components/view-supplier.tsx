"use client";
import { useState } from "react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, LinkIcon, UserCircle, KeyRound } from "lucide-react";
import type { Supplier } from "@/lib/types";
import Link from "next/link";

interface ViewSupplierProps {
  supplier: Supplier;
  triggerButton: React.ReactNode;
}

const DetailRow = ({
  label,
  value,
  icon: Icon,
  isLink = false,
  canCopy = false,
}: {
  label: string;
  value: string | null | undefined;
  icon: React.ElementType;
  isLink?: boolean;
  canCopy?: boolean;
}) => {
  if (!value) return null; // Don't render if value is empty

  return (
    <div className="flex items-center gap-x-3 gap-y-1 py-1.5 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2 w-20 text-sm text-muted-foreground shrink-0">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      <div className="flex-1 text-sm font-medium text-foreground break-words mr-2">
        {" "}
        {/* Allow word break */}
        {isLink ? (
          // Render as a clickable link, ensure URL has protocol
          <Link
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            {value}
          </Link>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
};

export const ViewSupplier = ({
  supplier,
  triggerButton,
}: ViewSupplierProps) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen} // Use direct setter
      title={`供应商详情: ${supplier?.name ?? ""}`}
      description={supplier?.description || "登录凭据及相关信息"} // Use description if available
      triggerButton={triggerButton} // Use passed trigger
      dialogClassName="sm:max-w-md" // Limit width
      showMobileFooter={true}
    >
      <div className="flex flex-col space-y-1 mt-2">
        <DetailRow
          label="网址"
          value={supplier.site}
          icon={LinkIcon}
          isLink={true}
          canCopy={true}
        />
        <DetailRow
          label="用户名"
          value={supplier.username}
          icon={UserCircle}
          canCopy={true}
        />
        <DetailRow
          label="密码"
          value={supplier.password}
          icon={KeyRound}
          canCopy={true}
        />
        {/* Add other relevant fields if necessary */}
      </div>
    </ResponsiveModal>
  );
};
