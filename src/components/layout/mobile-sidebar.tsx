"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import DashboardNav from "../dashboard-nav";
import { routes } from "@/route/routes";
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const MobileSidebar = ({ className }: SidebarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <HamburgerMenuIcon className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="!px-0 flex flex-col gap-3 h-dvh overflow-auto"
        >
          <SheetHeader className="items-center">
            <SheetTitle className="font-medium mt-2 mb-2 px-4 text-lg tracking-tight">
              Luna Tech
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              管理后台
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <DashboardNav setOpen={setOpen} routes={routes} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
