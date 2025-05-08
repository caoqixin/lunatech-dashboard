"use client";

import type { Customer } from "@/lib/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreVertical, Pencil } from "lucide-react";
import { EditCustomer } from "./edit-customer";
import { ViewCustomerRepairInfo } from "./view-customer-repair-info";
import { useRouter } from "next/navigation";

interface CustomerActionWrapperProps {
  customer: Customer;
}

export const CustomerActionWrapper = ({
  customer,
}: CustomerActionWrapperProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter(); // Get router for refresh callback

  // Refresh callback
  const handleSuccess = () => {
    router.refresh();
  };

  // --- Desktop View ---
  if (isDesktop) {
    return (
      <div className="flex items-center justify-end space-x-1">
        <ViewCustomerRepairInfo
          customerId={customer.id}
          customerName={customer.name}
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="查看维修记录"
            >
              <Eye className="size-4" />
            </Button>
          }
        />
        <EditCustomer
          customer={customer}
          onSuccess={handleSuccess} // Pass refresh callback
          triggerButton={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="编辑客户"
            >
              <Pencil className="size-4" />
            </Button>
          }
        />
        {/* Add DeleteCustomer here if needed */}
      </div>
    );
  }

  // --- Mobile View ---
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="更多操作"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* View Repairs Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <ViewCustomerRepairInfo
              customerId={customer.id}
              customerName={customer.name}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  <Eye className="mr-2 size-4" /> 查看维修记录
                </div>
              }
            />
          </DropdownMenuItem>
          {/* Edit Customer Action */}
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="p-0 cursor-pointer"
          >
            <EditCustomer
              customer={customer}
              onSuccess={handleSuccess}
              triggerButton={
                <div className="flex items-center w-full px-2 py-1.5 text-sm">
                  <Pencil className="mr-2 size-4" /> 编辑客户
                </div>
              }
            />
          </DropdownMenuItem>
          {/* Add Delete DropdownMenuItem here if needed, wrapping DeleteCustomer */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomerActionWrapper; // Keep if needed
