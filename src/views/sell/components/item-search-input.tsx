"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Adjust path
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust path
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust path
import { ImageIcon, Loader, AlertTriangle } from "lucide-react"; // Adjust path
import type { SellStock } from "@/lib/types"; // Adjust path
import { fetchSellableItemById, searchSellableItemsForSale } from "../api/sell"; // Adjust path
import { debounce } from "lodash";
import { cn, toEUR } from "@/lib/utils";
import { SaleListItem } from "./sell-page"; // Import SaleListItem type
import { toast } from "sonner";
import { CommandLoading } from "cmdk";

interface ItemSearchInputProps {
  onItemScannedOrSelected: (item: SellStock) => void;
  currentSaleItems: SaleListItem[]; // Pass current sale items to filter out already added ones
}

export const ItemSearchInput = ({
  onItemScannedOrSelected,
  currentSaleItems,
}: ItemSearchInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SellStock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const localInputRef = useRef<HTMLInputElement>(null);

  // Debounce the actual search API call
  const debouncedFetchSuggestions = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const results = await searchSellableItemsForSale(searchTerm);
        // Filter out items already in the current sale to avoid re-adding or showing them
        const availableResults = (results ?? []).filter(
          (res) =>
            !currentSaleItems.some((saleItem) => saleItem.id === res.id) &&
            res.quantity > 0
        );
        setSuggestions(availableResults);
      } catch (err: any) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300), // 300ms debounce
    [currentSaleItems] // Re-create debounce if currentSaleItems change to re-filter results
  );

  // Call debounced search when query changes
  useEffect(() => {
    if (showSuggestions) {
      // Only fetch suggestions if list is meant to be shown
      debouncedFetchSuggestions(inputValue);
    }
    return () => debouncedFetchSuggestions.cancel();
  }, [inputValue, showSuggestions, debouncedFetchSuggestions]);

  const processItemId = async (itemId: string) => {
    if (!itemId.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false); // Hide suggestions when processing an ID

    try {
      // API to fetch a single item by its EXACT ID (barcode)
      // This function needs to be created in your sell.api.ts
      const item = await fetchSellableItemById(itemId.trim());

      if (item) {
        if (item.quantity > 0) {
          onItemScannedOrSelected(item); // Pass the full item to parent
          setInputValue(""); // Clear input after successful processing
        } else {
          toast.error(`商品 "${item.name}" (ID: ${itemId}) 已无库存。`);
          setInputValue(""); // Clear input
        }
      } else {
        toast.error(`商品 ID "${itemId}" 未找到或无效。`);
        // setInputValue(""); // Optionally clear on not found, or let user edit
      }
    } catch (error: any) {
      // console.error("Error processing item ID:", error);
      toast.error(error.message || "处理商品ID时出错。");
    } finally {
      setIsLoading(false);
      // Focus input again for next scan/entry
      localInputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if this input is in a form
      processItemId(inputValue);
    }
  };

  const handleSuggestionSelect = (itemValue: string) => {
    // itemValue here is sellable_item.id from the suggestion list
    const selectedItem = suggestions.find((s) => s.id === itemValue);
    if (selectedItem) {
      processItemId(selectedItem.id); // Process it as if it was scanned/entered
    }
    setShowSuggestions(false); // Close suggestions
  };

  return (
    <Command
      shouldFilter={false} // We handle filtering via API and in `searchResults`
      className="relative rounded-lg border shadow-sm overflow-visible bg-background"
    >
      <CommandInput
        ref={localInputRef}
        value={inputValue}
        onValueChange={(value) => {
          setInputValue(value);
          if (value.trim().length > 1) {
            // Show suggestions after 2 chars
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
            setSuggestions([]);
          }
        }}
        onKeyDown={handleKeyDown} // Process on Enter
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="扫描或输入商品ID/名称/条码后按回车"
        className="h-12 pl-1 text-base rounded-t-lg rounded-b-none border-0 border-b focus-visible:ring-0" // Larger input, remove bottom border if list below
        disabled={isLoading} // Disable while a search is in progress
        autoFocus
      />
      {isLoading && (
        <Loader className="absolute right-3 top-4 size-5 animate-spin text-primary" />
      )}

      {/* Suggestion List */}

      {showSuggestions &&
        inputValue.length > 1 &&
        (suggestions.length > 0 || isLoading) && (
          <CommandList
            // Position below input, full width of command, theme styles
            className="absolute z-20 mt-0 w-full rounded-b-lg border-x border-b bg-popover shadow-md max-h-80 p-0 top-[50px]"
          >
            <ScrollArea className="max-h-80">
              {/* Ensure list itself is scrollable */}
              <div className="p-1">
                {/* Padding for items inside scroll area */}
                {isLoading &&
                  suggestions.length === 0 && ( // Show specific loading only if no prior results
                    <CommandLoading>
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        正在搜索...
                      </div>
                    </CommandLoading>
                  )}
                {!isLoading &&
                  inputValue.length > 1 &&
                  suggestions.length === 0 && (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      无匹配建议。
                    </div>
                  )}
                {suggestions.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id} // Use ID as the value for selection
                    onSelect={handleSuggestionSelect}
                    className="flex items-center justify-between gap-3 p-2 cursor-pointer hover:bg-accent"
                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur on item click
                    disabled={item.quantity <= 0} // Disable if out of stock
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Avatar className="h-8 w-8 rounded-sm border">
                        {item.image_url ? (
                          <AvatarImage
                            src={item.image_url}
                            alt={item.name}
                            className="object-contain"
                          />
                        ) : (
                          <AvatarFallback className="rounded-sm bg-muted">
                            <ImageIcon className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          ID: {item.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">
                        {toEUR(item.selling_price)}
                      </span>
                      <span
                        className={cn(
                          "text-xs whitespace-nowrap",
                          item.quantity > 0
                            ? "text-green-600"
                            : "text-destructive font-medium"
                        )}
                      >
                        库存: {item.quantity > 0 ? item.quantity : "无货"}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </div>
            </ScrollArea>
          </CommandList>
        )}
    </Command>
  );
};
