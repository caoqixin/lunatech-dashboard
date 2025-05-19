"use client";
import { useState, useEffect, useCallback, useTransition } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";
import type { SaleListItem } from "@/views/sell/components/sell-page";
import {
  getSaleList,
  saveSaleList,
  clearSaleList,
} from "@/views/sell/api/sell";

interface UsePersistentSaleListOptions {
  debounceMs?: number; // Debounce time for saving to Redis
}

interface UsePersistentSaleListResult {
  saleItems: SaleListItem[];
  setSaleItems: React.Dispatch<React.SetStateAction<SaleListItem[]>>;
  isLoading: boolean; // Loading state for initial fetch from Redis
  isSaving: boolean; // Saving state for async save to Redis
  clearPersistedSale: () => Promise<void>; // Function to clear list from Redis
  // You might add add/remove/update item functions here that also trigger save
}

export const usePersistentSaleList = ({
  debounceMs = 1000, // Default debounce to 1 second
}: UsePersistentSaleListOptions = {}): UsePersistentSaleListResult => {
  const [saleItems, setSaleItems] = useState<SaleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For initial load from Redis
  const [isSaving, startSavingTransition] = useTransition(); // For save operations

  // Load initial sale list from Redis on mount
  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      // console.log("Hook: Fetching initial sale list from Redis...");
      setIsLoading(true);
      try {
        const persistedItems = await getSaleList();
        if (isMounted) {
          setSaleItems(persistedItems);
          // console.log("Hook: Initial sale list loaded.", persistedItems);
        }
      } catch (error) {
        // Error is logged in server action, client might show generic error or ignore
        // console.error("Hook: Failed to load initial sale list.", error);
        if (isMounted) setSaleItems([]); // Default to empty on error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced function to save current saleItems to Redis via Server Action
  const debouncedSaveToRedis = useCallback(
    debounce(async (itemsToSave: SaleListItem[]) => {
      // Do not save an empty list to Redis after it's been cleared,
      // unless that's the explicit intent (e.g., after checkout).
      // The clearPersistedSale function handles explicit deletion.
      if (itemsToSave.length === 0 && !isLoading) {
        // Avoid saving empty during initial load
        // Check if Redis already has an empty list or no list.
        // For simplicity, if items are empty, we can choose not to write to Redis,
        // assuming 'clear' explicitly handles deletion.
        // console.log(
        //   "Hook: Skipping save of empty list (will be handled by clear if needed)."
        // );
        return;
      }

      startSavingTransition(async () => {
        // console.log(
        //   "Hook: Debounced save to Redis executing...",
        //   itemsToSave.length,
        //   "items"
        // );
        const result = await saveSaleList(itemsToSave);
        if (result.status == "error") {
          toast.error(result.msg || "自动保存在线出库单失败。");
        } else {
          // Optional: subtle success toast for auto-save? Usually not needed.
          // toast.success("出库单已自动保存在线。");
        }
      });
    }, debounceMs),
    [debounceMs, isLoading] // isLoading in dep array to avoid save on initial load
  );

  // Effect to trigger debounced save when saleItems change
  useEffect(() => {
    // Don't trigger save during initial load or if saleItems is empty due to initial load failure
    if (!isLoading && saleItems) {
      // Check if saleItems is not null/undefined
      debouncedSaveToRedis(saleItems);
    }
    // Cleanup debounce on unmount or if dependencies change
    return () => {
      debouncedSaveToRedis.cancel();
    };
  }, [saleItems, isLoading, debouncedSaveToRedis]);

  // Function to clear the sale list both locally and from Redis
  const clearPersistedSale = useCallback(async () => {
    setSaleItems([]); // Clear local state immediately for responsiveness
    startSavingTransition(async () => {
      // Use transition for visual feedback
      const result = await clearSaleList();
      if (result.status == "error") {
        toast.error(result.msg || "清空在线出库单失败。");
      } else {
        // toast.info("出库单已清空。");
      }
    });
  }, []);

  return {
    saleItems,
    setSaleItems, // Expose the raw setter
    isLoading,
    isSaving,
    clearPersistedSale,
  };
};
