"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useTransition,
  useRef,
  useMemo,
} from "react";
import type { CellContext } from "@tanstack/react-table";
import type { SellStock } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Minus, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import Image from "next/image";
import { toast } from "sonner";
import { updateProductStock } from "../api/sell_stock_admin";

// --- Editable Stock Cell ---
export const EditableSellStockQuantityCell = React.memo(
  ({ getValue, row }: CellContext<SellStock, number>) => {
    const initialValue = useMemo(() => getValue() ?? 0, [getValue]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState<number>(initialValue);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setCurrentValue(initialValue);
    }, [initialValue]);
    useEffect(() => {
      if (isEditing && inputRef.current) inputRef.current.select();
    }, [isEditing]);

    const handleSave = useCallback(() => {
      if (currentValue !== initialValue && !isNaN(currentValue)) {
        const stockValue = Math.max(0, currentValue);
        startTransition(async () => {
          try {
            // API function specific to updating only stock for a sellable item
            const { msg, status } = await updateProductStock(
              row.original.id,
              stockValue
            );
            if (status === "success") {
              toast.success(msg || "库存更新成功!");
            } else {
              toast.error(msg || "库存更新失败。");
              setCurrentValue(initialValue); // Revert
            }
          } catch (error: any) {
            toast.error(`更新失败: ${error.message || "未知错误"}`);
            setCurrentValue(initialValue); // Revert
          } finally {
            setIsEditing(false);
          }
        });
      } else {
        setIsEditing(false);
        if (currentValue !== initialValue) setCurrentValue(initialValue);
      }
    }, [currentValue, initialValue, row.original.id, startTransition]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSave();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setCurrentValue(initialValue);
        setIsEditing(false);
      }
    };
    const adjustStock = (amount: number) => {
      setCurrentValue((prev) => Math.max(0, prev + amount));
    };
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    if (isEditing) {
      return (
        <div className="flex items-center justify-center gap-1 w-24 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => adjustStock(-1)}
            onMouseDown={handleMouseDown}
            disabled={isPending}
          >
            <Minus className="size-3" />
          </Button>
          <Input
            ref={inputRef}
            type="number"
            min="0"
            value={currentValue}
            onChange={(e) => setCurrentValue(parseInt(e.target.value, 10) || 0)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 w-12 text-sm text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            disabled={isPending}
            aria-label="编辑库存"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => adjustStock(1)}
            onMouseDown={handleMouseDown}
            disabled={isPending}
          >
            <Plus className="size-3" />
          </Button>
          {isPending && (
            <Loader className="absolute -right-5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
          )}
        </div>
      );
    }
    return (
      <div
        className={cn(
          "text-center font-semibold text-sm cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded min-h-[28px] flex items-center justify-center w-fit mx-auto",
          currentValue <= 0
            ? "text-destructive"
            : currentValue <= 10
            ? "text-yellow-600 dark:text-yellow-400"
            : "text-green-600 dark:text-green-400"
        )}
        onClick={() => setIsEditing(true)}
        title="点击编辑库存"
      >
        {currentValue}
      </div>
    );
  }
);
EditableSellStockQuantityCell.displayName = "EditableSellStockQuantityCell";

// --- Image Preview Cell with Clickable Modal ---
export const ClickableImagePreviewCell = React.memo(
  ({ getValue, row }: CellContext<SellStock, string | null | undefined>) => {
    const imageUrl = getValue();
    const itemName = row.original.name;
    const [openModal, setOpenModal] = useState(false);

    return (
      <>
        <Avatar
          className="h-10 w-10 rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => imageUrl && setOpenModal(true)} // Only open if there's an image
          title={imageUrl ? "点击查看大图" : "无图片"}
        >
          {imageUrl ? (
            <AvatarImage
              src={imageUrl}
              alt={itemName}
              className="object-contain"
            />
          ) : (
            <AvatarFallback className="rounded-md bg-muted">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>

        {imageUrl && ( // Conditionally render Modal
          <ResponsiveModal
            open={openModal}
            onOpenChange={setOpenModal}
            title={`预览: ${itemName}`}
            triggerButton={<></>} // Trigger is handled by clicking the Avatar
            dialogClassName="sm:max-w-lg md:max-w-xl lg:max-w-2xl !p-0" // Wider, remove padding for image
            showMobileFooter={true} // Simple close for mobile
          >
            <div className="relative aspect-square max-h-[80vh] w-full bg-muted/30 flex items-center justify-center overflow-hidden">
              <Image
                src={imageUrl}
                alt={`${itemName} 大图预览`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </ResponsiveModal>
        )}
      </>
    );
  }
);

ClickableImagePreviewCell.displayName = "ClickableImagePreviewCell";
