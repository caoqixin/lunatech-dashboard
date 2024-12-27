"use client";

import { useMediaQuery } from "@uidotdev/usehooks";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

interface ResponsiveActionModalProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const ResponsiveActionModal = ({
  title,
  description,
  children,
}: ResponsiveActionModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ?? ""}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description ?? ""}</DrawerDescription>
      </DrawerHeader>
      {children}
      <DrawerFooter className="pt-2">
        <DrawerClose asChild>
          <Button variant="outline">取消</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
};

export default ResponsiveActionModal;
