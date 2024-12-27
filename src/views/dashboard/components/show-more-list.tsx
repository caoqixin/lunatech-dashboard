"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Eye } from "lucide-react";

interface ShowMoreListProps {
  data: {
    name: string;
    count: number;
  }[];
}

export const ShowMoreList = ({ data }: ShowMoreListProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-3 w-full">
          <Eye /> 查看更多
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-4 min-h-full overflow-auto">
        <SheetHeader>
          <SheetTitle>手机维修 - 机型排行榜</SheetTitle>
          <SheetDescription>热门机型</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          {data.length > 0 ? (
            data.map((phone, index) => (
              <div className="flex items-center" key={index}>
                <span>{index + 1}.</span>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {phone.name.trim()}
                  </p>
                </div>
                <div className="ml-auto font-medium">{phone.count} 次</div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center">
              暂时还没有数据
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
