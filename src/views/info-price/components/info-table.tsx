import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Component } from "@/lib/types";
import { toEUR } from "@/lib/utils";
import { Loader, XCircle } from "lucide-react";

interface InfoTableProps {
  components: Component[];
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader className="w-8 h-8 animate-spin mr-2" />
        数据查询中...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center h-32 text-red-500">
        <XCircle className="w-8 h-8 mr-2" />
        {errorMsg}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>配件名称</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>品质</TableHead>
          <TableHead>供应商</TableHead>
          <TableHead>库存</TableHead>
          <TableHead>维修价格</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {components.map((component) => (
          <TableRow
            key={component.id}
            className="hover:bg-gray-50 transition-colors"
          >
            <TableCell>{component.name}</TableCell>
            <TableCell>{component.category}</TableCell>
            <TableCell>
              <Badge
                variant={
                  component.quality === "高"
                    ? "default"
                    : component.quality === "中"
                    ? "secondary"
                    : "destructive"
                }
              >
                {component.quality}
              </Badge>
            </TableCell>
            <TableCell>{component.supplier}</TableCell>
            <TableCell>
              {component.stock > 0 ? (
                <Badge variant="outline" className="text-green-600">
                  有货
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-nowrap">
                  需要预订
                </Badge>
              )}
            </TableCell>
            <TableCell>{toEUR(component.public_price)}</TableCell>
            <TableCell className="text-right">
              {component.stock > 0 ? (
                <Button
                  onClick={() => handleClickRepair(component)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  去维修
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  需要订购
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InfoTable;
