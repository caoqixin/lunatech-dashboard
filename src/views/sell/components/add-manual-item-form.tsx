"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Eraser } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

interface AddManualItemFormProps {
  onAddItem: (name: string, price: number) => void;
}

export const AddManualItemForm: React.FC<AddManualItemFormProps> = ({
  onAddItem,
}) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(""); // Store as string to allow for decimal input
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const price = parseFloat(itemPrice);

    if (!itemName.trim()) {
      toast.error("请输入商品名称。");
      nameInputRef.current?.focus();
      return;
    }
    if (isNaN(price) || price < 0) {
      toast.error("请输入有效的商品价格。");
      // Optionally focus price input
      return;
    }

    onAddItem(itemName.trim(), price);
    // Clear form after adding
    setItemName("");
    setItemPrice("");
    nameInputRef.current?.focus(); // Focus back to name for next entry
  };

  const handleClearForm = () => {
    setItemName("");
    setItemPrice("");
    nameInputRef.current?.focus();
  };

  return (
    <Card className="shadow-md border-border/50">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-base font-semibold flex items-center gap-1.5">
          <PlusCircle className="size-5 text-primary" />
          手动添加商品/服务
        </CardTitle>
        <CardDescription className="text-xs">
          用于添加不在库存中或一次性的商品/服务。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="manualItemName" className="text-xs font-medium">
              商品/服务名称 *
            </Label>
            <Input
              id="manualItemName"
              ref={nameInputRef}
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="例如: iPhone 11 换屏幕"
              className="h-9 mt-1"
            />
          </div>
          <div>
            <Label htmlFor="manualItemPrice" className="text-xs font-medium">
              售价 (€) *
            </Label>
            <Input
              id="manualItemPrice"
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="例如: 80.00"
              min="0"
              step="0.01"
              className="h-9 mt-1"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearForm}
              className="flex-1"
            >
              <Eraser className="mr-1.5 size-3.5" /> 清空
            </Button>
            <Button type="submit" size="sm" className="flex-1">
              <PlusCircle className="mr-1.5 size-4" /> 添加到销售单
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
