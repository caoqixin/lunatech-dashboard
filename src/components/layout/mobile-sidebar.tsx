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
import { MenuIcon } from "lucide-react";
import { Sidebar } from "./sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import VisuallyHidden from "../custom/visually-hidden";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>mobile sidebar</SheetTitle>
            <SheetDescription>mobile sidebar</SheetDescription>
          </SheetHeader>
        </VisuallyHidden>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
