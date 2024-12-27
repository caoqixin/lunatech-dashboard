"use client";

import { Customer, RepairInfo } from "@/lib/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ViewCustomerRepairInfo } from "./view-customer-repair-info";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { Eye, MoreVertical, Pencil } from "lucide-react";
import { fetchRepairInfo } from "../api/customer";
import { EditCustomer } from "./edit-customer";

interface CustomerActionWrapperProps {
  customer: Customer;
}

type Content = "view" | "edit";

export const CustomerActionWrapper = ({
  customer,
}: CustomerActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<Content | null>(null);
  const [repairInfo, setRepairInfo] = useState<RepairInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewRepairs = async () => {
    if (isDesktop) {
      setIsLoading(true);
      const data = await fetchRepairInfo(customer.id);
      setRepairInfo(data);
      setIsLoading(false);
    } else {
      setActiveContent("view");
      setDrawerOpen(true);
      setIsLoading(true);
      const data = await fetchRepairInfo(customer.id);
      setRepairInfo(data);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setActiveContent(null);
  };

  if (isDesktop) {
    return (
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <ViewCustomerRepairInfo
            title={customer.name}
            repairInfo={repairInfo}
            isLoading={isLoading}
            onClick={handleViewRepairs}
          />
          <EditCustomer customer={customer} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end">
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DrawerTrigger asChild>
              <DropdownMenuItem
                onSelect={handleViewRepairs}
                className="flex items-start gap-2 cursor-pointer"
              >
                <Eye className="size-4" />
                维修记录
              </DropdownMenuItem>
            </DrawerTrigger>
            <DrawerTrigger asChild>
              <DropdownMenuItem
                onSelect={() => {
                  setActiveContent("edit");
                }}
                className="flex items-start gap-2 cursor-pointer"
              >
                <Pencil className="size-4" />
                修改
              </DropdownMenuItem>
            </DrawerTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        {drawerOpen && (
          <div>
            {activeContent === "view" && (
              <ViewCustomerRepairInfo
                title={customer.name}
                repairInfo={repairInfo}
                isLoading={isLoading}
                isDropDownMenu={true}
              />
            )}
            {activeContent === "edit" && (
              <EditCustomer
                customer={customer}
                isDropDownMenu={true}
                onCancel={() => handleClose()}
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CustomerActionWrapper;
