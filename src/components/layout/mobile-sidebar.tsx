"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ExitIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import DashboardNav from "../dashboard-nav";
import { routes } from "@/route/routes";
import { Button } from "../ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const MobileSidebar = ({ className }: SidebarProps) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <HamburgerMenuIcon className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <SheetHeader className="items-center">
            <SheetTitle className="font-medium mt-2 mb-2 px-4 text-lg tracking-tight">
              Xintech - Admin
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              管理后台
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 mt-5">
            <div className="px-2">
              <DashboardNav setOpen={setOpen} routes={routes} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
