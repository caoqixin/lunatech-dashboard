import { useState } from "react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { Supplier } from "@/lib/types";

interface ViewSupplierProps {
  supplier: Supplier;
  isDropDownMenu?: boolean;
}

export const ViewSupplier = ({
  supplier,
  isDropDownMenu = false,
}: ViewSupplierProps) => {
  const [open, setOpen] = useState(false);

  if (isDropDownMenu) {
    return (
      <ResponsiveModal
        open={open}
        onOpen={setOpen}
        dropdownMenu={isDropDownMenu}
        title={`${supplier.name} 登录信息`}
      >
        <div className="flex flex-col space-y-4">
          {/* 网址 */}
          <div className="flex items-center gap-4">
            <Label className="min-w-[100px] text-right">网址</Label>
            <p className="flex-1 border-b border-b-black text-left">
              {supplier.site}
            </p>
          </div>

          {/* 登录名 */}
          <div className="flex items-center gap-4">
            <Label className="min-w-[100px] text-right">登录名</Label>
            <p className="flex-1 border-b border-b-black text-left">
              {supplier.username}
            </p>
          </div>

          {/* 密码 */}
          <div className="flex items-center gap-4">
            <Label className="min-w-[100px] text-right">密码</Label>
            <p className="flex-1 border-b border-b-black text-left">
              {supplier.password}
            </p>
          </div>
        </div>
      </ResponsiveModal>
    );
  }

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      title={`${supplier.name} 登录信息`}
      triggerButton={
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="size-4" /> 查看
        </Button>
      }
    >
      <div className="flex flex-col space-y-4">
        {/* 网址 */}
        <div className="flex items-center gap-4">
          <Label className="min-w-[100px] text-right">网址</Label>
          <p className="flex-1 border-b border-b-black text-left">
            {supplier.site}
          </p>
        </div>

        {/* 登录名 */}
        <div className="flex items-center gap-4">
          <Label className="min-w-[100px] text-right">登录名</Label>
          <p className="flex-1 border-b border-b-black text-left">
            {supplier.username}
          </p>
        </div>

        {/* 密码 */}
        <div className="flex items-center gap-4">
          <Label className="min-w-[100px] text-right">密码</Label>
          <p className="flex-1 border-b border-b-black text-left">
            {supplier.password}
          </p>
        </div>
      </div>
    </ResponsiveModal>
  );
};
