import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Component } from "@/lib/types"; // 假设 Qualities 枚举在 types.ts 中定义
import { getQualityBadgeStyle, toEUR } from "@/lib/utils";
import { Loader, XCircle, ShoppingCart, Wrench } from "lucide-react";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { cn } from "@/lib/utils"; // 引入 cn
import { Qualities } from "@/views/component/schema/component.schema";

interface InfoTableProps {
  components: Component[] | null;
  isLoading: boolean;
  errorMsg: string;
  handleClickRepair: (item: Component) => void;
}

const InfoTable: React.FC<InfoTableProps> = ({
  components,
  isLoading,
  errorMsg,
  handleClickRepair,
}) => {
  // 加载状态
  if (isLoading) {
    return (
      <div className="space-y-2 pt-4">
        <SkeletonWrapper count={5} variant="table-row" />
      </div>
    );
  }

  // 错误状态
  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-destructive/50 bg-destructive/5 px-4 py-10 text-center text-destructive">
        <XCircle className="size-8 mb-2" />
        <p className="font-medium">加载失败</p>
        <p className="text-sm">{errorMsg}</p>
      </div>
    );
  }

  // 无数据状态
  if (!components || components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-10 text-center text-muted-foreground">
        <ShoppingCart className="size-8 mb-2" />
        <p className="font-medium">暂无配件信息</p>
        <p className="text-sm">
          请确认手机型号是否正确，或此型号暂无配件记录。
        </p>
      </div>
    );
  }

  // 正常显示表格
  return (
    <div className="rounded-md border">
      <Table>
        {/* 表头保持不变 */}
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">配件名称</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>品质</TableHead>
            <TableHead>供应商</TableHead>
            <TableHead className="text-center">库存</TableHead>
            <TableHead className="text-right min-w-[100px]">维修价格</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => {
            // 获取当前品质的样式和标签
            const qualityStyle = getQualityBadgeStyle(
              component.quality as Qualities
            ); // 假设 component.quality 匹配 Qualities 枚举

            return (
              <TableRow key={component.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{component.name}</TableCell>
                <TableCell>{component.category}</TableCell>
                <TableCell>
                  {/* 应用获取到的样式和标签 */}
                  <Badge
                    variant={qualityStyle.variant}
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      qualityStyle.className
                    )} // 添加基础样式和计算出的类名
                  >
                    {qualityStyle.label}
                  </Badge>
                </TableCell>
                <TableCell>{component.supplier || "-"}</TableCell>
                <TableCell className="text-center">
                  {component.stock > 0 ? (
                    <Badge
                      variant="outline"
                      className="border-green-300 text-green-700 text-nowrap bg-green-50 dark:border-green-700 dark:text-green-400 dark:bg-green-900/30"
                    >
                      {component.stock} 件
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-nowrap">
                      需预订
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {toEUR(component.public_price)}
                </TableCell>
                <TableCell className="text-right">
                  {component.stock > 0 ? (
                    <Button
                      onClick={() => handleClickRepair(component)}
                      size="sm"
                      variant="default"
                    >
                      <Wrench className="mr-1.5 size-4" />
                      去维修
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      需订购
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableCaption>价格仅供参考，实际价格以门店为准。</TableCaption>
      </Table>
    </div>
  );
};

export default InfoTable;
