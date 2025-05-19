"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"; // Dialog is usually better for lots of data
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRecentSales, SalesRecordWithItems } from "../api/sell";
import { Loader, AlertTriangle, History } from "lucide-react";
import { toEUR } from "@/lib/utils";
import date from "@/lib/date";
import { DateTimePicker } from "@/components/ui/date-picker"; // Assuming you have a DatePicker
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // For expandable items
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface SalesHistoryModalProps {
  triggerButton?: React.ReactNode; // Optional custom trigger
}

const ITEMS_PER_PAGE_MODAL = 5; // How many main records per page inside modal

export const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({
  triggerButton,
}) => {
  const [open, setOpen] = useState(false);
  const [sales, setSales] = useState<SalesRecordWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE_MODAL);

  const loadHistory = useCallback(async (page: number, dateToFetch?: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const dateString = dateToFetch
        ? date(dateToFetch).format("YYYY-MM-DD")
        : undefined;
      const { records: fetchedSales, count } = await fetchRecentSales({
        page,
        perPage: ITEMS_PER_PAGE_MODAL,
        date: dateString,
      });
      setSales(fetchedSales);
      setTotalRecords(count);
    } catch (err: any) {
      setError(err.message || "无法加载销售历史。");
      setSales([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when modal opens or date/page changes
  useEffect(() => {
    if (open) {
      loadHistory(currentPage, selectedDate);
    }
  }, [open, selectedDate, currentPage, loadHistory]);

  const handleDateChange = (newDate?: Date) => {
    setSelectedDate(newDate);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset to today and first page when opening
      // setSelectedDate(new Date()); // Already default or consider if keeping last view
      setCurrentPage(1);
      // loadHistory(1, new Date()); // useEffect will trigger this
    } else {
      // Optionally reset state when closing
      // setError(null);
      // setSales([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        {triggerButton ?? ( // Default trigger if none provided
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <History className="size-4" /> 查看销售记录
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl md:max-w-2xl lg:max-w-3xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" /> 销售历史记录
          </DialogTitle>
          <DialogDescription>查看近期的销售订单和明细。</DialogDescription>
        </DialogHeader>

        {/* Filters and Content Area */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <Label
              htmlFor="sales-date"
              className="text-sm font-medium shrink-0"
            >
              选择日期:
            </Label>
            <div className="flex items-center gap-2">
              <DateTimePicker
                value={selectedDate}
                onChange={handleDateChange} // Pass the handler
                placeholder="选择日期"
              />
              {/* Button to clear date selection */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateChange(undefined)} // Set date to undefined to clear
                disabled={!selectedDate} // Disable if no date is selected
                className="text-xs"
              >
                查看全部日期
              </Button>
            </div>
          </div>

          {/* Content based on state */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader className="mr-2 size-5 animate-spin" /> 加载中...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-destructive text-center">
                <AlertTriangle className="size-6 mb-2" />
                <p className="font-medium mb-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadHistory(currentPage, selectedDate)}
                >
                  重试
                </Button>
              </div>
            ) : sales.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">
                {selectedDate
                  ? date(selectedDate).format("YYYY年MM月DD日")
                  : "所有日期"}
                暂无销售记录。
              </div>
            ) : (
              // Accordion for expandable sales records
              <Accordion type="single" collapsible className="w-full space-y-2">
                {sales.map((sale) => (
                  <AccordionItem
                    value={sale.id}
                    key={sale.id}
                    className="border rounded-md bg-background"
                  >
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">
                            订单ID:
                            <span className="font-mono text-primary">
                              {sale.id.substring(0, 8)}...
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {date(sale.sold_at).format("YYYY-MM-DD HH:mm:ss")}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <Badge variant="outline">{sale.items_count} 件</Badge>
                          <span className="font-semibold text-base">
                            {toEUR(sale.total_amount)}
                          </span>
                          {/* <ChevronsUpDown className="h-4 w-4 shrink-0 transition-transform duration-200" /> */}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 pt-1 border-t">
                      <h4 className="text-xs font-medium mb-1.5 text-muted-foreground">
                        商品明细:
                      </h4>
                      <ScrollArea className="max-h-48">
                        {/* Scroll for long item lists */}
                        <Table className="text-xs">
                          <TableHeader>
                            <TableRow>
                              <TableHead>名称</TableHead>
                              <TableHead className="text-center">
                                数量
                              </TableHead>
                              <TableHead className="text-right">单价</TableHead>
                              <TableHead className="text-right">小计</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sale.sale_record_items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium truncate max-w-[150px]">
                                  {item.item_name}
                                </TableCell>
                                <TableCell className="text-center">
                                  {item.quantity_sold}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {toEUR(item.price_at_sale)}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {toEUR(item.subtotal)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Pagination for modal content */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <span className="text-sm text-muted-foreground">
                第 {currentPage} / {totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
