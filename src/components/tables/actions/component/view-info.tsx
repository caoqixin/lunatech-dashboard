import { RepairComponent, Supplier } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";

export default function ViewInfo({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <EyeOpenIcon className="w-4 h-4" /> 详情
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{name} 详情信息</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<div>loading ....</div>}>{children}</Suspense>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              关闭
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
