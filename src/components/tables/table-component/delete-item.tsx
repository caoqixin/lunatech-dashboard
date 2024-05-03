"use client";

import { AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction } from "react";

interface DeleteItemProps {
  name: string;
  title: string;
  pending: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
}

export default function DeleteItem({
  name,
  title,
  pending,
  open,
  setOpen,
  onDelete,
}: DeleteItemProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <TrashIcon className="w-4 h-4" /> 删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除{title}</AlertDialogTitle>
          <AlertDescription className="text-red-500">
            确定要删除{title} [{name}] 吗?, 该操作是不可逆, 慎重考虑
          </AlertDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>取消</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 flex items-center"
            onClick={onDelete}
            disabled={pending}
          >
            {pending && <ReloadIcon className="animate-spin" />}
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
