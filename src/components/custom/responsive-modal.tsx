"use client";
import { useMedia } from "react-use";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface ResponsiveModalProps {
  width?: string;
  triggerButton?: React.ReactNode;
  title: string;
  description?: string;
  dropdownMenu?: boolean;
  children: React.ReactNode;
  open: boolean;
  onOpen: (open: boolean) => void;
}

export const ResponsiveModal = ({
  width,
  title,
  description,
  triggerButton,
  children,
  open,
  onOpen,
  dropdownMenu = false,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 768px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className={`sm:max-w-[${width ?? 465}px]`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description ?? ""}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  if (dropdownMenu) {
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
  }

  return (
    <Drawer open={open} onOpenChange={onOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
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
    </Drawer>
  );
};
