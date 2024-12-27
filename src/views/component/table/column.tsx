"use client";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Component } from "@/lib/types";
import { cn, toEUR } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ComponentActionWrapper from "@/views/component/components/component-action-wrapper";
import { ShowMoreModelButton } from "@/views/component/components/show-more-model-button";
import { useEffect, useState } from "react";
import {
  updateComponentName,
  updateComponentQuality,
  updateComponentStock,
} from "@/views/component/api/component";
import { toast } from "sonner";
import {
  DataTableHideColumn,
  DataTableSearchableColumn,
} from "@/components/data-table/type";
import { Qualities } from "@/views/component/schema/component.schema";
import { Minus, Plus } from "lucide-react";

export const componentColumns: ColumnDef<Component>[] = [
  {
    accessorKey: "name",
    header: "名称",
    cell: ({ getValue, row }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      const [isEditing, setIsEditing] = useState(false);

      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const onBlur = async () => {
        if (value !== initialValue) {
          const { msg, status } = await updateComponentName(
            (value as string).trim(),
            row.original.id
          );

          if (status === "success") {
            toast.success(msg);
          } else {
            toast.error(msg);
          }
        }

        setIsEditing(false);
      };

      return isEditing ? (
        <input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="w-36 font-semibold"
          autoFocus={isEditing}
        />
      ) : (
        <span className="font-semibold w-28" onClick={() => setIsEditing(true)}>
          {value as string}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "分类",
  },
  {
    accessorKey: "brand",
    header: "品牌",
  },
  {
    accessorKey: "quality",
    header: "品质",
    cell: ({ getValue, row }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      const [isEditing, setIsEditing] = useState(false);

      const handleChange = async (newValue: string) => {
        if (newValue !== value) {
          setValue(newValue);
          const { msg, status } = await updateComponentQuality(
            newValue,
            row.original.id
          );

          if (status === "success") {
            toast.success(msg);
          } else {
            toast.error(msg);
          }
        }

        setIsEditing(false);
      };

      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return isEditing ? (
        <Select defaultValue={value as string} onValueChange={handleChange}>
          <SelectTrigger className="w-30">
            <SelectValue placeholder="选择品质" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Qualities).map((quality) => (
              <SelectItem key={quality} value={quality}>
                {quality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="font-extrabold" onClick={() => setIsEditing(true)}>
          {value as string}
        </span>
      );
    },
  },
  {
    accessorKey: "model",
    header: "适配机型",
    cell: ({ row }) => {
      const models = row.original.model;

      return (
        <div>
          {models ? (
            models.length > 1 ? (
              <div className="flex gap-2 w-44">
                <Badge variant="outline">{models[0]}</Badge>
                <ShowMoreModelButton models={models} name={row.original.name} />
              </div>
            ) : (
              <Badge variant="outline">{models[0]}</Badge>
            )
          ) : (
            <Badge variant="outline">通用</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: () => {
      return <span className="text-nowrap">库存数量</span>;
    },
    cell: ({ row, getValue }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue);
      const [isEditing, setIsEditing] = useState(false);

      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const onBlur = async () => {
        if (value !== initialValue) {
          const { msg, status } = await updateComponentStock(
            value as number,
            row.original.id
          );
          if (status === "success") {
            toast.success(msg);
          } else {
            toast.error(msg);
          }
        }

        setIsEditing(false);
      };

      const onPlus = (e: React.MouseEvent) => {
        e.preventDefault();
        setValue((prevValue: number) => (prevValue as number) + 1);
      };
      const onMinus = (e: React.MouseEvent) => {
        e.preventDefault();
        setValue((prevValue: number) => Math.max(0, (prevValue as number) - 1));
      };

      const onChangeValue = (newValue: string) => {
        const parsedValue = Number(newValue);
        setValue(isNaN(parsedValue) ? 0 : Math.max(0, parsedValue));
      };

      return isEditing ? (
        <div className="flex items-center justify-between">
          <Plus
            className="size-3"
            onClick={onPlus}
            onMouseDown={(e) => e.preventDefault()}
          />
          <input
            className="w-10 border border-black rounded-md"
            onBlur={onBlur}
            autoFocus={isEditing}
            value={value as string}
            onChange={(e) => onChangeValue(e.target.value)}
          />
          <Minus
            className="size-3"
            onClick={onMinus}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
      ) : (
        <span
          className={cn(
            "ml-6 text-lg",
            (value as number) > 0 ? "text-green-500" : "text-red-600"
          )}
          onClick={() => setIsEditing(true)}
        >
          {value as number}
        </span>
      );
    },
  },
  {
    accessorKey: "public_price",
    header: "报价",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-xl">
          {toEUR(row.original.public_price)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ComponentActionWrapper component={row.original} />;
    },
  },
];

export const componentSearchColumn: DataTableSearchableColumn<Component>[] = [
  {
    id: "name",
    placeholder: "请输入配件名称或者编号 ......",
  },
];

export const componentInitialHidenColumn: DataTableHideColumn<Component>[] = [
  {
    id: "brand",
    value: false,
  },
];
