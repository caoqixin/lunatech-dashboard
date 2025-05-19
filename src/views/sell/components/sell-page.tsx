"use client";

import { useState, useCallback, useMemo } from "react";

import type { SellStock } from "@/lib/types";
import { processCheckout, SaleItemForCheckout } from "../api/sell";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ItemSearchInput } from "./item-search-input";
import { SaleItemsList } from "./sale-items-list";
import { SaleSummaryAndActions } from "./sale-summary-actions";
import { useRouter } from "next/navigation";
import { usePersistentSaleList } from "@/hooks/use-persistent-sale-list";
import { uniqueId } from "lodash";
import date from "@/lib/date";
import { AddManualItemForm } from "./add-manual-item-form";
import { MANUEL_PRODUCT_PREFIX } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SalesHistoryModal } from "./sales-history-modal";

// Type for items in the current sale list
export type SaleListItem = SellStock & {
  quantityInSale: number;
  priceAtSale: number; // Price per unit at the time it was added/sold
};

export const SellPage = () => {
  const router = useRouter();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const {
    saleItems: currentSaleItems, // Rename for clarity within this component
    setSaleItems: setCurrentSaleItems, // Get the setter from the hook
    isLoading: isLoadingSaleList, // Loading state for the initial list
    isSaving: isSavingSaleList, // Saving state for background saves
    clearPersistedSale, // Function to clear list from Redis and locally
  } = usePersistentSaleList({
    debounceMs: 800,
  });

  // --- Item Management Callbacks ---
  const handleItemScannedOrSelected = useCallback(
    (scannedItem: SellStock) => {
      setCurrentSaleItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === scannedItem.id);

        if (existingItem) {
          if (existingItem.quantityInSale < scannedItem.quantity) {
            toast.success(`"${scannedItem.name}" 数量 +1`);
            return prevItems.map((i) =>
              i.id === scannedItem.id
                ? { ...i, quantityInSale: i.quantityInSale + 1 }
                : i
            );
          } else {
            toast.warning(
              `商品 "${scannedItem.name}" 库存不足 (最大: ${scannedItem.quantity})`
            );
            return prevItems; // No change if stock limit reached
          }
        } else {
          // Add new item, only if it has stock
          if (scannedItem.quantity > 0) {
            toast.success(`"${scannedItem.name}" 已添加到销售单`);
            return [
              ...prevItems,
              {
                ...scannedItem,
                quantityInSale: 1,
                priceAtSale: scannedItem.selling_price,
              },
            ];
          } else {
            // This case should ideally be caught by fetchSellableItemById or ItemSearchInput already
            toast.error(`商品 "${scannedItem.name}" 已无库存。`);
            return prevItems;
          }
        }
      });
    },
    [setCurrentSaleItems]
  );

  const handleUpdateItemQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      setCurrentSaleItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            // Find original item stock to check against
            // This assumes 'item' in prevItems still has the original 'quantity' field from SellableItem
            const originalStock = item.quantity;
            if (newQuantity > originalStock) {
              toast.warning(
                `库存不足，"${item.name}" 最多可售 ${originalStock} 件。`
              );
              return { ...item, quantityInSale: Math.max(1, originalStock) }; // Cap at max stock, min 1
            }
            return { ...item, quantityInSale: Math.max(1, newQuantity) }; // Ensure at least 1
          }
          return item;
        })
      );
    },
    [setCurrentSaleItems]
  );

  const handleRemoveItemFromSale = useCallback(
    (itemId: string) => {
      setCurrentSaleItems((prevItems) =>
        prevItems.filter((i) => i.id !== itemId)
      );
    },
    [setCurrentSaleItems]
  );

  const handleClearSale = useCallback(async () => {
    if (
      window.confirm("确定要清空当前销售单吗？此操作也会清除在线保存的记录。")
    ) {
      await clearPersistedSale(); // Call hook's function
      toast.info("销售单已清空。");
    }
  }, [clearPersistedSale]);

  // --- Checkout ---
  const handleCheckout = async () => {
    if (currentSaleItems.length === 0) {
      toast.error("销售单为空！");
      return;
    }
    setIsProcessingCheckout(true);
    const itemsToCheckout: SaleItemForCheckout[] = currentSaleItems.map(
      (item) => ({
        itemId: item.id,
        itemName: item.name, // Current name
        quantitySold: item.quantityInSale,
        priceAtSale: item.priceAtSale, // Use price recorded at time of adding/editing
      })
    );

    const result = await processCheckout(itemsToCheckout);
    if (result.status == "success") {
      toast.success(result.msg || "结账成功！");
      await clearPersistedSale();
    } else {
      toast.error(result.msg || "结账失败，请检查库存或联系管理员。");
    }
    setIsProcessingCheckout(false);
  };

  // Calculate total amount
  const totalAmount = useMemo(
    () =>
      currentSaleItems.reduce(
        (sum, item) => sum + item.quantityInSale * item.priceAtSale,
        0
      ),
    [currentSaleItems]
  );

  // add product manual
  const handleAddManualItemToSale = useCallback(
    (name: string, price: number) => {
      if (!name.trim() || isNaN(price) || price < 0) {
        toast.error("请输入有效的商品名称和价格。");
        return;
      }

      const newItem: SaleListItem = {
        id: uniqueId(MANUEL_PRODUCT_PREFIX), // Generate a unique ID for the manual item
        name: name.trim(),
        selling_price: price,
        priceAtSale: price,
        quantityInSale: 1,
        category: null,
        image_url: null,
        quantity: 999,
        supplier_name: null,
        purchase_price: null,
        created_at: date().toISOString(),
        updated_at: date().toISOString(),
      };
      setCurrentSaleItems((prev) => [...prev, newItem]);
      toast.success(`"${name}" 已添加到销售单`);
    },
    [currentSaleItems, setCurrentSaleItems]
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-muted/20 overflow-hidden">
      {/* Header/Navbar (Optional - could be part of a wider POS layout) */}
      <header className="bg-background border-b p-3 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-semibold">前台销售</h1>

        <div className="flex items-center gap-2">
          <SalesHistoryModal />
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            报价
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            返回后台
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[minmax(320px,1.5fr)_minmax(0,3fr)] lg:grid-cols-[minmax(350px,1fr)_2.5fr] gap-3 p-3 overflow-hidden">
        {/* Left Side: Item Search & Results (takes more space on larger screens) */}
        <div className="md:h-full max-md:h-52 bg-background rounded-lg shadow-sm border overflow-y-auto">
          <div className="md:flex md:flex-col md:h-full md:justify-between p-3 space-y-4">
            <div>
              <ItemSearchInput
                onItemScannedOrSelected={handleItemScannedOrSelected}
                currentSaleItems={currentSaleItems}
              />
            </div>
            <div>
              <AddManualItemForm onAddItem={handleAddManualItemToSale} />
            </div>
          </div>
        </div>

        {/* Right Side: Current Sale List and Summary */}
        <div className="flex flex-col bg-background rounded-lg shadow-md border overflow-hidden">
          {/* Sale Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <SaleItemsList
              items={currentSaleItems}
              onUpdateQuantity={handleUpdateItemQuantity}
              onRemoveItem={handleRemoveItemFromSale}
              isLoading={isLoadingSaleList}
            />
          </div>
          {/* Summary and Actions */}
          <SaleSummaryAndActions
            totalAmount={totalAmount}
            itemCount={currentSaleItems.reduce(
              (sum, item) => sum + item.quantityInSale,
              0
            )}
            onCheckout={handleCheckout}
            onClearSale={handleClearSale}
            isProcessing={isProcessingCheckout}
          />
        </div>
      </main>
    </div>
  );
};
