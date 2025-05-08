"use client";

import type { Component } from "@/lib/types";
import {
  Package,
  Tag,
  Shapes,
  Building,
  Warehouse,
  Euro,
  ScanLine,
  Smartphone,
  Gem,
} from "lucide-react";
import { useState } from "react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { getQualityBadgeStyle, toEUR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewComponentProps {
  component: Component;
  triggerButton: React.ReactNode; // Expect trigger
}

// Simple Key-Value Row Component
const DetailRow = ({
  label,
  value,
  icon: Icon,
  children,
}: {
  label: string;
  value?: string | number | null;
  icon: React.ElementType;
  children?: React.ReactNode;
}) => {
  // Don't render if no value and no children
  if (!value && !children && value !== 0) return null;

  return (
    <div className="flex items-start gap-x-3 py-2 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-1.5 w-24 text-sm text-muted-foreground shrink-0 pt-0.5">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      <div className="flex-1 text-sm font-medium text-foreground break-words">
        {children ?? value ?? (
          <span className="italic text-muted-foreground/80">未提供</span>
        )}
      </div>
    </div>
  );
};

export const ViewComponent = ({
  component,
  triggerButton,
}: ViewComponentProps) => {
  const [open, setOpen] = useState(false);

  // Get quality badge style
  const qualityStyle = component.quality
    ? getQualityBadgeStyle(component.quality)
    : null;

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title={`配件详情: ${component?.name ?? ""}`}
      description={`查看 ${component?.name ?? "配件"} 的详细信息`}
      triggerButton={triggerButton}
      dialogClassName="sm:max-w-lg"
      showMobileFooter={true}
    >
      {/* Make content scrollable */}
      <ScrollArea className="h-[70vh] px-1">
        <div className="flex flex-col space-y-1 py-2">
          <DetailRow label="名称" value={component.name} icon={Package} />
          {component.code && (
            <DetailRow label="编号" value={component.code} icon={ScanLine} />
          )}
          {component.alias && (
            <DetailRow label="别名" value={component.alias} icon={Tag} />
          )}
          <DetailRow label="分类" value={component.category} icon={Shapes} />
          <DetailRow label="品牌" value={component.brand} icon={Apple} />{" "}
          {/* Example: Replace Apple with a generic Brand icon */}
          <DetailRow label="品质" icon={Gem}>
            {qualityStyle ? (
              <Badge
                variant={qualityStyle.variant}
                className={qualityStyle.className}
              >
                {qualityStyle.label}
              </Badge>
            ) : (
              "-"
            )}
          </DetailRow>
          <DetailRow
            label="供应商"
            value={component.supplier}
            icon={Building}
          />
          <DetailRow label="库存" value={component.stock} icon={Warehouse} />
          <DetailRow
            label="采购价 (€)"
            value={toEUR(component.purchase_price)}
            icon={Euro}
          />
          <DetailRow
            label="维修报价 (€)"
            value={component.public_price ? toEUR(component.public_price) : "-"}
            icon={Euro}
          />
          <DetailRow label="适配机型" icon={Smartphone}>
            {component.model && component.model.length > 0 ? (
              <div className="flex w-full flex-wrap gap-1.5">
                {component.model.map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="italic text-muted-foreground/80">
                通用或未指定
              </span>
            )}
          </DetailRow>
        </div>
      </ScrollArea>
    </ResponsiveModal>
  );
};

// Placeholder Brand icon (replace with actual or remove if not needed)
const Apple = ({ className }: { className?: string }) => (
  <svg
    className={
      className
    } /* SVG content for a generic brand icon or Apple logo */
  />
);
