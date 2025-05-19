"use client";

import React from "react";
import type { SaleListItem } from "./sell-page"; // Import type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Plus,
  Minus,
  XCircle,
  ShoppingCart,
  Loader,
} from "lucide-react";
import { toEUR } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SaleItemsListProps {
  items: SaleListItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  isLoading?: boolean;
}

export const SaleItemsList: React.FC<SaleItemsListProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin" /> 加载中...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center p-10 text-center text-muted-foreground bg-muted/30">
        <ShoppingCart className="size-12 mb-4" />
        <p className="text-lg font-medium">销售单为空</p>
        <p className="text-sm">请通过上方搜索框添加配件。</p>
      </div>
    );
  }

  return (
    // Use ScrollArea for potentially long lists
    <ScrollArea className="h-full">
      {/* Ensure ScrollArea has a height constraint from parent */}
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
          >
            {/* Image */}
            <Avatar className="h-12 w-12 rounded-md border shrink-0">
              {item.image_url ? (
                <AvatarImage
                  src={item.image_url}
                  alt={item.name}
                  className="object-contain"
                />
              ) : (
                <AvatarFallback className="rounded-md bg-muted">
                  <ImageIcon className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>

            {/* Name & Price */}
            <div className="flex-1 overflow-hidden space-y-0.5">
              <p className="text-sm font-medium truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                单价:
                <span className="font-semibold text-foreground">
                  {toEUR(item.priceAtSale)}
                </span>
              </p>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() =>
                  onUpdateQuantity(item.id, item.quantityInSale - 1)
                }
                disabled={item.quantityInSale <= 1} // Disable if quantity is 1
                aria-label={`减少 ${item.name} 数量`}
              >
                <Minus className="size-3.5" />
              </Button>

              <Input
                type="number"
                value={item.quantityInSale}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onUpdateQuantity(item.id, val); // Update with parsed value
                  }
                }}
                onBlur={(e) => {
                  // Ensure quantity is at least 1 on blur
                  const val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 1) {
                    onUpdateQuantity(item.id, 1);
                  }
                }}
                min="1"
                className="h-7 w-12 text-center px-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label={`${item.name} 数量`}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() =>
                  onUpdateQuantity(item.id, item.quantityInSale + 1)
                }
                // Consider disabling if quantityInSale reaches item.quantity (max stock)
                aria-label={`增加 ${item.name} 数量`}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>

            {/* Subtotal */}
            <div className="w-20 text-right shrink-0">
              <p className="text-sm font-semibold">
                {toEUR(item.quantityInSale * item.priceAtSale)}
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemoveItem(item.id)}
              aria-label={`移除 ${item.name}`}
            >
              <XCircle className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
