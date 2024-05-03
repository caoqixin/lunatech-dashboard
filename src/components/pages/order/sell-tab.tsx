"use client";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { fetchComponents } from "@/lib/actions/components";
import {
  addStock,
  addToDataList,
  changeOrderPrice,
  getDataList,
  minusStock,
  removeAllItem,
  removeItem,
  saveOutData,
} from "@/lib/actions/orders";
import { OrderComponent, RedisOrderType } from "@/lib/definitions";
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
import _ from "lodash";

export default function SellTab({ orders }: { orders: RedisOrderType }) {
  const [inputValue, setInputValue] = useState<string>("");
  const [components, setComponents] = useState<OrderComponent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const deboundedSearchValue = useDebounce(inputValue, 500);

  const [dataList, updateDataList] = useState<RedisOrderType>(orders);
  const [ids, updateIds] = useState<number[]>([]);
  const previous = usePrevious(ids);

  const { toast } = useToast();

  // 获取数据
  const getData = async () => {
    const data = await getDataList();
    updateDataList(data);

    if (data) {
      const ids = Object.keys(data).map((value) => {
        return parseInt(value);
      });

      updateIds(ids);
    }
  };

  // 添加数据
  const handleClick = async (component: OrderComponent) => {
    const res = await addToDataList({ ...component, stock: 1 });

    if (res) {
      // 如果添加成功的话更新数据
      await getData();
    }
  };

  // 移除数据
  const handleRemove = async (field: string) => {
    const res = await removeItem(field);
    if (res) {
      await getData();
    }
  };

  // 获取配件数据
  const getComponents = async (value: string, ids?: number[]) => {
    setLoading(true);

    if (!dataList) {
      const data = await fetchComponents(value);
      if (data) {
        setComponents(data);
      } else {
        setComponents(null);
      }
    }

    const data = await fetchComponents(value, ids);

    if (data) {
      setComponents(data);
    } else {
      setComponents(null);
    }
    setLoading(false);
  };

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

  const modifyStock = async (
    action: "add" | "minus",
    data: [string, OrderComponent & { stock: number }]
  ) => {
    if (data) {
      const key = data[0];
      const value = data[1];

      if (action == "add") {
        const currentValue = value.stock;
        value.stock += 1;
        const res = await addStock(key, value);

        if (res?.status == "success") {
          toast({
            title: res.msg,
          });
          await getData();
        } else {
          value.stock = currentValue;
          toast({
            title: res?.msg,
            variant: "destructive",
          });
        }
      }

      if (action == "minus" && value.stock > 0) {
        const currentValue = value.stock;
        value.stock -= 1;
        // 如果数量等于0
        if (value.stock == 0) {
          // 删除
          const res = await removeItem(key);
          if (res) {
            await getData();
          }
          return;
        }

        const res = await minusStock(key, value);
        if (res?.status == "success") {
          toast({
            title: res.msg,
          });
          await getData();
        } else {
          value.stock = currentValue;
          toast({
            title: res?.msg,
            variant: "destructive",
          });
        }
      }

      return;
    }
  };

  // 搜索时
  useEffect(() => {
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
        return;
      }
    } else {
      setComponents(null);
    }
  }, [dataList]);

  const changePrice = async (
    e: ChangeEvent<HTMLInputElement>,
    data: [string, OrderComponent & { stock: number }]
  ) => {
    const price = e.target.value;
    const key = data[0];
    const value = data[1];

    if (parseInt(price) < 0) {
      value.public_price = "0";
    }
    value.public_price = price;
    const res = await changeOrderPrice(key, value);
    if (res?.status == "success") {
      toast({
        title: res.msg,
      });
      e.target.value = toEUR(e.target.value);
    } else {
      toast({
        title: res?.msg,
        variant: "destructive",
      });
    }
  };

  const wareHouse = async () => {
    if (dataList) {
      const data = Object.values(dataList);

      const res = await saveOutData(data);

      if (res.status == "success") {
        const fields = Object.keys(dataList);
        const isAllRemoved = await removeAllItem(fields);
        if (isAllRemoved) {
          await getData();
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
            <div className="flex items-center justify-center h-[100px]">
              没有找到 {inputValue} 相关配件
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
      <div>
        <ScrollArea className="h-[240px] p-2">
          <Table>
            <TableCaption>出库单</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">代号</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>分类</TableHead>
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
                    <TableCell>{data[1].category}</TableCell>
                    <TableCell>
                      <Input
                        defaultValue={toEUR(data[1].public_price)}
                        onBlur={(e) => changePrice(e, data)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {data[1].stock > 0 ? (
                        <Tips
                          content="减少"
                          icon={
                            <MinusIcon className="cursor-pointer h-4 w-4" />
                          }
                          onClick={() => modifyStock("minus", data)}
                        />
                      ) : (
                        ""
                      )}
                      {data[1].stock}
                      <Tips
                        content="增加"
                        icon={<PlusIcon className="cursor-pointer h-4 w-4" />}
                        onClick={() => modifyStock("add", data)}
                      />
                    </TableCell>
                    <TableCell>
                      {toEUR(data[1].stock * parseFloat(data[1].public_price))}
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
                    暂无出库配件
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
                        (prev += parseFloat(item[1].public_price)) *
                        item[1].stock,
                      0
                    )
                  )
                : toEUR(0)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>操作</div>
            <div>
              <Button onClick={() => wareHouse()}>出库</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
