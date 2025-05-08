"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, MoreVertical, Pencil, Trash } from "lucide-react";

import { UpdateBrand } from "@/views/brand/components/update-brand";
import { DeleteBrand } from "@/views/brand/components/delete-brand";
import type { Brand } from "@/lib/types";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface InfoCardProps {
  brand: Brand;
  onSuccess: () => void;
}

export const InfoCard = ({ brand, onSuccess }: InfoCardProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    // Navigate to the detail page for this brand
    router.push(`/dashboard/phones/${brand.id}`); // Adjust path as needed
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      {/* Action Menu - Positioned top-right */}
      <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-background/70 hover:bg-muted/90"
              aria-label="品牌操作"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Edit Trigger */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <UpdateBrand
                brand={brand}
                onSuccess={onSuccess}
                triggerButton={
                  <div className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer">
                    <Pencil className="mr-2 size-4" /> 修改
                  </div>
                }
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Delete Trigger */}
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="p-0"
            >
              <DeleteBrand
                brand={brand}
                onSuccess={onSuccess}
                triggerButton={
                  <div className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash className="mr-2 size-4" /> 删除
                  </div>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Clickable Content Area */}
      <div
        className="flex flex-1 flex-col cursor-pointer"
        onClick={handleNavigate}
        title={`查看 ${brand.name} 型号`} // Tooltip for click action
      >
        <CardContent className="flex flex-1 items-center justify-center p-4 aspect-square">
          {" "}
          {/* Aspect ratio for consistency */}
          {brand.brand_image ? (
            <div className="relative h-16 w-16 transition-transform group-hover:scale-105">
              {" "}
              {/* Scale image on hover */}
              <Image
                alt={`${brand.name} Logo`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
                className="object-contain rounded-full" // Contain and maybe rounded
                src={brand.brand_image}
                // Add unoptimized if using external URLs without loader config
                // unoptimized
              />
            </div>
          ) : (
            <Avatar className="h-16 w-16 rounded-full">
              {" "}
              {/* Match size */}
              <AvatarFallback className="rounded-md text-xl font-semibold bg-muted">
                {/* Get first char */}
                {brand.name?.charAt(0).toUpperCase() || (
                  <ImageIcon className="size-8 text-muted-foreground" />
                )}
              </AvatarFallback>
            </Avatar>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center items-center p-2.5">
          {/* Brand name */}
          <span className="text-sm font-medium truncate">{brand.name}</span>
        </CardFooter>
      </div>
    </Card>
  );
};

export default InfoCard;
