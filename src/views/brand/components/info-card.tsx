"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, MoreVertical, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { UpdateBrand } from "@/views/brand/components/update-brand";
import { DeleteBrand } from "@/views/brand/components/delete-brand";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "@/lib/types";

interface InfoCardProps {
  brand: Brand;
}

type ContentType = "edit" | "delete";

export const InfoCard = ({ brand }: InfoCardProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [activeContent, setActiveContent] = useState<ContentType | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    setOpen(false);
    setActiveContent(null);
  };

  const renderResponsiveContent = useMemo(() => {
    if (isDesktop) {
      return (
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="size-5 rounded-full hover:bg-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="flex w-full items-center gap-x-2"
                    onSelect={() => setActiveContent("edit")}
                  >
                    <Pencil className="size-4" /> 修改
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="flex w-full items-center gap-x-2 text-destructive"
                    onSelect={() => setActiveContent("delete")}
                  >
                    <Trash className="size-4" /> 删除
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            {open && (
              <>
                {activeContent == "edit" && (
                  <UpdateBrand brand={brand} onCancel={handleClose} />
                )}
                {activeContent == "delete" && (
                  <DeleteBrand brand={brand} onCancel={handleClose} />
                )}
              </>
            )}
          </Dialog>
        </div>
      );
    } else {
      return (
        <div>
          <Drawer open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical className="size-5 rounded-full hover:bg-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DrawerTrigger asChild>
                  <DropdownMenuItem
                    className="flex w-full items-center gap-x-2"
                    onSelect={() => setActiveContent("edit")}
                  >
                    <Pencil className="size-4" /> 修改
                  </DropdownMenuItem>
                </DrawerTrigger>
                <DrawerTrigger asChild>
                  <DropdownMenuItem
                    className="flex w-full items-center gap-x-2 text-destructive"
                    onSelect={() => setActiveContent("delete")}
                  >
                    <Trash className="size-4" /> 删除
                  </DropdownMenuItem>
                </DrawerTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            {open && (
              <>
                {activeContent == "edit" && (
                  <UpdateBrand brand={brand} onCancel={handleClose} />
                )}
                {activeContent == "delete" && (
                  <DeleteBrand brand={brand} onCancel={handleClose} />
                )}
              </>
            )}
          </Drawer>
        </div>
      );
    }
  }, [isDesktop, open, activeContent, brand]);

  return (
    <Card className="cursor-pointer">
      <CardHeader className="p-0">
        <CardTitle className="flex justify-end mr-1 mt-1">
          {renderResponsiveContent}
        </CardTitle>
      </CardHeader>
      <CardContent
        className="flex items-center justify-center p-6"
        onClick={() => router.push(`${pathname}/${brand.id}`)}
      >
        {brand.brand_image ? (
          <div className="size-16 relative rounded-md overflow-hidden">
            <Image
              alt="Logo"
              fill
              className="object-cover"
              src={brand.brand_image}
            />
          </div>
        ) : (
          <Avatar className="size-16">
            <AvatarFallback>
              <ImageIcon className="size-8" />
            </AvatarFallback>
          </Avatar>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-center items-center p-2">
        {brand.name}
      </CardFooter>
    </Card>
  );
};

export default InfoCard;
