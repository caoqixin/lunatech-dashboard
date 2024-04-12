"use client";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductComponent, RedisProductType } from "@/lib/definitions";
import { toEUR } from "@/lib/utils";
import {
  Cross1Icon,
  MinusIcon,
  PlusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useDebounce, usePrevious } from "@uidotdev/usehooks";
import { CommandLoading } from "cmdk";
import { ChangeEvent, useEffect, useState } from "react";
import Tips from "../_components/tips";
import { useToast } from "@/components/ui/use-toast";
import {
  addToProductList,
  getAllProduct,
  modifyProductStock,
  removeAllProduct,
  removeProduct,
  saveProductToDatabase,
} from "@/lib/actions/product";
import { fetchAllComponents } from "@/lib/actions/components";
import _ from "lodash";
import Link from "next/link";

export default function RecoverProduct({
  products,
}: {
  products: RedisProductType;
}) {
  const { toast } = useToast();

  const [inputValue, setInputValue] = useState<string>("");
  // 防抖
  const deboundedSearchValue = useDebounce(inputValue, 500);
  const [loading, setLoading] = useState(false);

  const [ids, updateIds] = useState<number[]>([]);
  const previous = usePrevious(ids);

  // 获取到的配件
  const [components, setComponents] = useState<ProductComponent[] | null>(null);

  const getComponents = async (value: string, ids?: number[]) => {
    setLoading(true);
    if (!dataList) {
      const data = await fetchAllComponents(value);
      if (data) {
        setComponents(data);
      } else {
        setComponents(null);
      }
    }

    const data = await fetchAllComponents(value, ids);

    if (data) {
      setComponents(data);
    } else {
      setComponents(null);
    }
    setLoading(false);
  };

  // 搜索框事件
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    if (dataList) {
      const ids = Object.keys(dataList).map((value) => {
        return parseInt(value);
      });

      if (deboundedSearchValue) {
        getComponents(deboundedSearchValue, ids);
      }
    } else {
      if (deboundedSearchValue) {
        getComponents(deboundedSearchValue);
      }
    }
  };

  // 数据表相关
  const [dataList, updateDataList] = useState<RedisProductType>(products);

  const getDataList = async () => {
    const data = await getAllProduct();
    updateDataList(data);
    if (data) {
      const ids = Object.keys(data).map((value) => {
        return parseInt(value);
      });

      updateIds(ids);
    }
  };

  // 添加数据
  const handleClick = async (component: ProductComponent) => {
    const res = await addToProductList(component);
    if (res) {
      // 如果添加成功的话更新数据
      await getDataList();
    }
  };

  // 移除数据
  const handleRemove = async (field: string) => {
    const res = await removeProduct(field);
    if (res) {
      await getDataList();
    }
  };

  const modifyStock = async (
    action: "add" | "minus",
    data: [string, ProductComponent]
  ) => {
    if (data) {
      const key = data[0];
      const value = data[1];

      if (action == "add") {
        value.count += 1;
        const res = await modifyProductStock(key, value);

        if (res?.status == "success") {
          toast({
            title: res.msg,
          });
          await getDataList();
        } else {
          toast({
            title: res?.msg,
            variant: "destructive",
          });
        }
      }

      if (action == "minus" && value.count > 0) {
        value.count -= 1;
        // 如果数量等于0
        if (value.count == 0) {
          // 删除
          const res = await removeProduct(key);
          if (res) {
            await getDataList();
          }
          return;
        }

        const res = await modifyProductStock(key, value);
        if (res?.status == "success") {
          toast({
            title: res.msg,
          });
          await getDataList();
        } else {
          toast({
            title: res?.msg,
            variant: "destructive",
          });
        }
      }

      return;
    }
  };

  // 入库操作
  const store = async () => {
    if (dataList) {
      const data = Object.values(dataList);

      const res = await saveProductToDatabase(data);

      if (res.status == "success") {
        const fields = Object.keys(dataList);
        const isAllRemoved = await removeAllProduct(fields);
        if (isAllRemoved) {
          await getDataList();
        }
        toast({
          title: res.msg,
        });
      } else {
        toast({
          variant: "destructive",
          title: res.msg,
        });
      }
    }
  };

  // 当输入发生变化是进行搜索
  useEffect(() => {
    // when searchValue is empty don't action
    if (deboundedSearchValue == "") {
      setComponents(null);
    }

    if (dataList) {
      const ids = Object.keys(dataList).map((value) => {
        return parseInt(value);
      });

      if (deboundedSearchValue) {
        getComponents(deboundedSearchValue, ids);
      }
    } else {
      if (deboundedSearchValue) {
        getComponents(deboundedSearchValue);
      }
    }
  }, [deboundedSearchValue]);

  // 数据变动时
  useEffect(() => {
    if (dataList) {
      const currentIds = Object.keys(dataList).map((value) => {
        return parseInt(value);
      });

      if (!_.isEqual(previous, currentIds)) {
        getComponents(deboundedSearchValue, currentIds);
      } else {
        setComponents(null);
      }
    } else {
      setComponents(null);
    }
  }, [dataList]);
  return (
    <div>
      <Command className="rounded-lg border shadow-md">
        <Input
          placeholder="输入配件编号或者配件名称"
          value={inputValue}
          onChange={handleChange}
          className="focus-visible:ring-0"
          onBlur={() => setComponents(null)}
          onFocus={handleFocus}
        />
        <CommandList>
          {loading && (
            <CommandLoading>
              <span className="flex items-center justify-center gap-4 h-[100px]">
                正在搜索配件 {inputValue}
                <ReloadIcon className="h-4 w-4 animate-spin" />
              </span>
            </CommandLoading>
          )}
          {!loading && components?.length == 0 && (
            <div className="flex flex-col items-center justify-center gap-2 h-[100px]">
              <span>没有找到 {inputValue} 相关配件</span>
              <Button onMouseDown={(e) => e.preventDefault()} asChild>
                <Link href={"/dashboard/components/create"}>
                  <PlusIcon /> 添加配件{" "}
                </Link>
              </Button>
            </div>
          )}
          {components && components.length != 0 && (
            <ScrollArea className="h-[100px]">
              {components.map((component) => (
                <CommandItem
                  key={component.id}
                  value={component.code ?? undefined}
                  onSelect={() => handleClick(component)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {component.name}
                </CommandItem>
              ))}
            </ScrollArea>
          )}
        </CommandList>
      </Command>

      <ScrollArea className="h-[240px] p-2">
        <Table>
          <TableCaption>入库单</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">代号</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>单价</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>总计</TableHead>
              <TableHead className="text-right">{""}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataList ? (
              Object.entries(dataList).map((data) => (
                <TableRow key={data[1].id}>
                  <TableCell>{data[1].code}</TableCell>
                  <TableCell>{data[1].name}</TableCell>
                  <TableCell>{toEUR(data[1].purchase_price)}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {data[1].count > 0 ? (
                      <Tips
                        content="减少"
                        icon={<MinusIcon className="cursor-pointer h-4 w-4" />}
                        onClick={() => modifyStock("minus", data)}
                      />
                    ) : (
                      ""
                    )}
                    {data[1].count}
                    <Tips
                      content="增加"
                      icon={<PlusIcon className="cursor-pointer h-4 w-4" />}
                      onClick={() => modifyStock("add", data)}
                    />
                  </TableCell>
                  <TableCell>
                    {toEUR(data[1].count * data[1].purchase_price)}
                  </TableCell>
                  <TableCell>
                    <Cross1Icon
                      className="h-4 w-4 rounded-full border cursor-pointer"
                      onClick={() => handleRemove(data[0])}
                      onMouseDown={(e) => e.preventDefault()}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  暂无入库配件
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>总金额</div>
          <div>
            {dataList
              ? toEUR(
                  Object.entries(dataList).reduce(
                    (prev, item) =>
                      (prev += item[1].count * item[1].purchase_price),
                    0
                  )
                )
              : toEUR(0)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>操作</div>
          <div>
            <Button onClick={() => store()}>入库</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
