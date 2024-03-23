import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Supplier } from "@prisma/client";
import { EyeOpenIcon } from "@radix-ui/react-icons";

export default function ViewInfo(supplier: Supplier) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <EyeOpenIcon className="w-4 h-4" /> 查看
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{supplier.name} 登录信息</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">网址</Label>
            <p className="col-span-3 border-b border-b-black">
              {supplier.site}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">登录名</Label>
            <p className="col-span-3 border-b border-b-black">
              {supplier.username}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">密码</Label>
            <p className="col-span-3 border-b border-b-black">
              {supplier.password}
            </p>
          </div>
        </div>
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
