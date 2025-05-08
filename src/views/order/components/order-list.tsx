"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
} from "react";

import { debounce } from "lodash";
import { toast } from "sonner";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Component } from "@/lib/types";
import { fetchComponentsByQuery } from "@/views/component/api/component";
import { CommandLoading } from "cmdk";
import { cn, toEUR } from "@/lib/utils";
import {
  Loader,
  Search,
  Plus,
  Minus,
  CircleX,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  checkout,
  getOrderList,
  saveOrderState,
} from "@/views/order/api/order";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type OrderListItem = Component & { quantity: number };

export const OrderList = () => {
  // Search State
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState(""); // 用于 Input 显示的值
  const [searchResults, setSearchResults] = useState<Component[] | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Order List State
  const [orderItems, setOrderItems] = useState<OrderListItem[]>([]); // Use OrderListItem type
  const [isLoadingOrder, setIsLoadingOrder] = useState(true); // Loading initial order list

  // Checkout State
  const [isCheckingOut, startCheckoutTransition] = useTransition();

  // 防抖处理
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim()) {
          setQuery(value);
        } else {
          setQuery("");
        }
        // 这里可以添加额外的处理逻辑，比如网络请求
      }, 300), // 防抖延迟 300 毫秒
    []
  );

  const handleQueryChange = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Fetch initial order list from storage/API
  useEffect(() => {
    const loadInitialOrder = async () => {
      setIsLoadingOrder(true);
      try {
        const data = await getOrderList();
        // Ensure quantity exists and is a number, default to 1 if missing
        const initializedData = (data ?? []).map((item) => ({
          ...item,
          quantity:
            typeof item.quantity === "number" && item.quantity > 0
              ? item.quantity
              : 1,
        }));
        setOrderItems(initializedData);
      } catch (error) {
        // console.error("Failed to load initial order list:", error);
        toast.error("无法加载当前出库单，请刷新页面。");
        setOrderItems([]); // Start with empty list on error
      } finally {
        setIsLoadingOrder(false);
      }
    };
    loadInitialOrder();
  }, []);

  // Fetch component search results when query changes
  useEffect(() => {
    // Skip fetch if query is empty or component already in order list
    if (!query) {
      setSearchResults(null);
      return;
    }

    if (
      !query ||
      orderItems.some(
        (item) =>
          item.code === query ||
          item.name.toLowerCase().includes(query.toLowerCase())
      )
    ) {
      return;
    }

    let isActive = true;
    const getComponents = async () => {
      setIsLoadingSearch(true);
      try {
        // Pass query directly
        const { data } = await fetchComponentsByQuery(query);
        if (isActive) {
          // Filter out components already in the order list
          const availableComponents = (data ?? []).filter(
            (comp) => !orderItems.some((orderItem) => orderItem.id === comp.id)
          );
          setSearchResults(
            availableComponents.length > 0 ? availableComponents : null
          );
        }
      } catch (error) {
        console.error("Failed to fetch components:", error);
        // Optionally show a toast for search failure
        if (isActive) setSearchResults(null);
      } finally {
        if (isActive) setIsLoadingSearch(false);
      }
    };

    getComponents();
    return () => {
      isActive = false;
    }; // Cleanup
  }, [query, orderItems]);

  // Save order state to storage whenever orderItems change (debounced potentially)
  const debouncedSaveOrder = useCallback(
    debounce((items: OrderListItem[]) => {
      // console.log("Saving order state:", items); // Debug log
      saveOrderState(JSON.stringify(items));
    }, 500), // Debounce saving by 500ms
    []
  );

  useEffect(() => {
    // Don't save during initial load
    if (!isLoadingOrder) {
      debouncedSaveOrder(orderItems);
    }
  }, [orderItems, isLoadingOrder, debouncedSaveOrder]);

  // --- Event Handlers ---

  const handleSelectItem = useCallback(
    (selectedComponentValue: string) => {
      // Find the component from CURRENT searchResults based on value (which is component.id as string)
      const componentToAddIndex = searchResults?.findIndex(
        (comp) => String(comp.id) === selectedComponentValue
      );

      // Ensure component exists in search results and isn't already in order list
      if (
        searchResults &&
        componentToAddIndex !== undefined &&
        componentToAddIndex > -1
      ) {
        const componentToAdd = searchResults[componentToAddIndex];
        // Check if already in orderItems (double check)
        if (orderItems.some((item) => item.id === componentToAdd.id)) {
          // console.warn("Component already in order list:", componentToAdd.name);
          // Optionally provide user feedback like a toast
          toast.warning(`配件 "${componentToAdd.name}" 已在出库单中。`);

          // Remove the selected item from search results even if already in list
          setSearchResults((prev) =>
            prev
              ? prev.filter((_, index) => index !== componentToAddIndex)
              : null
          );

          // Keep focus for further selection? Or blur? For now, keep focus implicitly.
          // setIsSearchFocused(false); // Don't set focus false

          return; // Stop processing if already added
        }

        // Add to order list with default quantity 1
        setOrderItems((prev) => [...prev, { ...componentToAdd, quantity: 1 }]);

        // Remove the selected item from searchResults state
        setSearchResults((prev) =>
          prev ? prev.filter((_, index) => index !== componentToAddIndex) : null
        );
      }
    },
    [searchResults, orderItems]
  );

  const handleQuantityChange = (itemId: number, newQuantityStr: string) => {
    const newQuantity = parseInt(newQuantityStr, 10);
    // Allow 0 for temporary input state, but ensure >= 1 in state logic if needed, or handle 0 on checkout
    const validatedQuantity = isNaN(newQuantity) ? 1 : Math.max(1, newQuantity); // Ensure quantity is at least 1

    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: validatedQuantity } : item
      )
    );
  };

  const handlePriceChange = (itemId: number, newPriceStr: string) => {
    const newPrice = parseFloat(newPriceStr);
    const validatedPrice = isNaN(newPrice) ? 0 : Math.max(0, newPrice); // Ensure non-negative price

    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, public_price: validatedPrice } : item
      )
    );
  };

  const adjustQuantity = (itemId: number, amount: number) => {
    setOrderItems((prev) =>
      prev.map(
        (item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) }
            : item // Ensure min 1
      )
    );
  };

  const removeItem = useCallback((itemId: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
    // Note: We don't add it back to search results automatically here
    // as the search result depends on the current query.
  }, []);

  const handleCheckout = useCallback(async () => {
    if (orderItems.length === 0) {
      toast.warning("出库单为空，请先添加配件。");
      return;
    }

    // Validate quantities and prices before checkout? (Optional)
    const invalidItem = orderItems.find(
      (item) => !item.quantity || item.quantity <= 0 || item.public_price < 0
    );
    if (invalidItem) {
      toast.error(`配件 "${invalidItem.name}" 的数量或价格无效。`);
      return;
    }

    startCheckoutTransition(async () => {
      try {
        const { msg, status } = await checkout(); // API now reads state from server/storage
        if (status === "success") {
          toast.success(msg || "出库成功！");
          setOrderItems([]); // Clear the list on success
          // saveOrderState("[]"); // Explicitly clear saved state too
        } else {
          toast.error(msg || "出库失败，请重试。");
        }
      } catch (error) {
        // console.error("Checkout error:", error);
        if (error instanceof Error) {
          try {
            // Try parsing potential JSON error details from server action
            const parsedError: { message: string; details?: string } =
              JSON.parse(error.message);
            toast.error(
              parsedError.details || parsedError.message || "出库过程中出错。"
            );
          } catch {
            toast.error(error.message || "出库过程中出错。");
          }
        } else {
          toast.error("出库过程中发生未知错误。");
        }
      }
    });
  }, [orderItems, startCheckoutTransition]); // Depend on orderItems

  // Calculate total amount
  const totalAmount = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) => sum + (item.quantity || 1) * (item.public_price || 0),
        0
      ),
    [orderItems]
  );

  return (
    // Use grid for layout: Search on left, Table on right? Or Search top, Table below.
    // Example: Search top, Table below
    <div className="space-y-4">
      {/* Search Command */}
      <Command
        shouldFilter={false}
        className="relative overflow-visible rounded-lg border shadow-sm"
      >
        <CommandInput
          placeholder="输入配件编号、名称或别名搜索..."
          value={inputValue} // Use query state directly for input value
          onValueChange={handleQueryChange} // Debounced update via handler
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)} // Delay blur
          className="h-10 pl-1" // Padding for icon
        />

        {isLoadingSearch && (
          <Loader className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
        )}
        {/* Conditional Command List */}
        {isSearchFocused && (query || isLoadingSearch || searchResults) && (
          <CommandList
            className={cn(
              "absolute z-20 w-full rounded-md border bg-popover p-1 shadow-lg",
              // Use top positioning relative to the Command container
              // h-11 input (44px) + ~6px gap = 50px
              "top-[50px]", // Adjust this value if needed (e.g., top-[48px] or top-[52px])
              "max-h-60 overflow-auto" // Height and scroll
            )}
            style={{ maxHeight: "15rem" }}
          >
            {isLoadingSearch && (
              <CommandLoading>
                <div className="p-2 text-center text-sm">正在加载...</div>
              </CommandLoading>
            )}
            {!isLoadingSearch && query && !searchResults && (
              <CommandEmpty>未找到 "{query}" 相关配件</CommandEmpty>
            )}
            {searchResults?.map((component) => (
              <CommandItem
                key={component.id}
                value={String(component.id)} // Value used for selection
                onSelect={handleSelectItem} // Call handler on select
                className="grid grid-cols-3 gap-2 items-center font-mono cursor-pointer text-sm p-2"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur on mouse down
              >
                <span className="text-muted-foreground truncate">
                  {component.code || "-"}
                </span>
                <span className="col-span-2 font-medium truncate">
                  {component.name}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>

      {/* Order List Table */}
      <div className="rounded-md border">
        <ScrollArea className="max-h-[55vh] min-h-[200px]">
          {/* Scrollable table area */}
          <Table>
            <TableCaption>当前出库单 ({orderItems.length} 项)</TableCaption>
            <TableHeader className="sticky top-0 bg-background z-10">
              {/* Sticky Header */}
              <TableRow>
                <TableHead className="w-[100px]">编号</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead className="w-[100px]">单价 (€)</TableHead>
                <TableHead className="w-[130px] text-center">数量</TableHead>
                <TableHead className="w-[100px] text-right">总计 (€)</TableHead>
                <TableHead className="w-[50px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingOrder ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <Loader className="inline-block mr-2 size-4 animate-spin" />
                    正在加载出库单...
                  </TableCell>
                </TableRow>
              ) : orderItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <ShoppingCart className="inline-block mr-2 size-5" />
                    出库单为空，请在上方搜索添加配件。
                  </TableCell>
                </TableRow>
              ) : (
                // Render actual items
                orderItems.map((item) => (
                  <TableRow key={item.id}>
                    {/* Code */}
                    <TableCell className="text-xs text-muted-foreground">
                      {item.code || "-"}
                    </TableCell>
                    {/* Name */}
                    <TableCell className="font-medium text-sm">
                      {item.name}
                    </TableCell>
                    {/* Category */}
                    <TableCell className="text-sm">{item.category}</TableCell>
                    {/* Price Input */}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.public_price ?? ""} // Controlled component
                        onChange={(e) =>
                          handlePriceChange(item.id, e.target.value)
                        }
                        className="h-8 text-sm w-full text-right px-1"
                        aria-label={`价格 ${item.name}`}
                      />
                    </TableCell>
                    {/* Quantity Input */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => adjustQuantity(item.id, -1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity} // Controlled
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="h-8 w-12 text-sm text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label={`数量 ${item.name}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => adjustQuantity(item.id, 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                    {/* Subtotal */}
                    <TableCell className="text-right font-mono text-sm">
                      {toEUR((item.quantity || 1) * (item.public_price || 0))}
                    </TableCell>
                    {/* Remove Action */}
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                        aria-label={`移除 ${item.name}`}
                      >
                        <CircleX className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Summary and Checkout Button */}
      {orderItems.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-3">
          <div className="flex items-center justify-between font-medium">
            <span>总计金额:</span>
            <span className="text-lg font-bold text-primary">
              {toEUR(totalAmount)}
            </span>
          </div>
          <Button
            disabled={isCheckingOut}
            onClick={handleCheckout}
            className="w-full h-10 text-base"
          >
            {isCheckingOut && <Loader className="mr-2 size-5 animate-spin" />}
            确认出库 ({orderItems.length} 项)
          </Button>
        </div>
      )}
    </div>
  );
};
