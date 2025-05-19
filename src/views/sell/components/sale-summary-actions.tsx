"use client";

import { Button } from "@/components/ui/button"; // Adjust path
import { Separator } from "@/components/ui/separator"; // Adjust path
import { toEUR } from "@/lib/utils"; // Adjust path
import { Loader, ShoppingCart, Trash2 } from "lucide-react"; // Import icons

interface SaleSummaryAndActionsProps {
  totalAmount: number;
  itemCount: number; // Total number of individual items (sum of quantities)
  onCheckout: () => Promise<void>; // Make async
  onClearSale: () => void;
  isProcessing: boolean; // For checkout loading state
}

export const SaleSummaryAndActions: React.FC<SaleSummaryAndActionsProps> = ({
  totalAmount,
  itemCount,
  onCheckout,
  onClearSale,
  isProcessing,
}) => {
  return (
    <div className="p-4 border-t bg-background space-y-3 shrink-0">
      {/* Summary Details */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">商品总数:</span>
          <span className="font-medium">{itemCount} 件</span>
        </div>
        {/* Add discount, tax, etc. here if needed */}
        <Separator />
        <div className="flex justify-between items-baseline pt-1">
          <span className="text-base font-semibold">应付总额:</span>
          <span className="text-xl font-bold text-primary">
            {toEUR(totalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={onClearSale}
          disabled={isProcessing || itemCount === 0} // Disable if processing or no items
          className="flex items-center gap-1.5"
        >
          <Trash2 className="size-4" /> 清空
        </Button>
        <Button
          onClick={onCheckout}
          disabled={isProcessing || itemCount === 0} // Disable if processing or no items
          className="flex items-center gap-1.5 text-base py-3 h-auto" // Larger checkout button
        >
          {isProcessing && <Loader className="mr-2 size-5 animate-spin" />}
          {isProcessing ? (
            "处理中..."
          ) : (
            <>
              <ShoppingCart className="mr-2 size-5" /> 结算
            </>
          )}
        </Button>
      </div>
      {/* Optional: Payment method selection, customer notes, etc. */}
    </div>
  );
};
