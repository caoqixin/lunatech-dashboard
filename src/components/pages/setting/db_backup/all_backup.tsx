"use client";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";

export default function AllBackupButton() {
  const [isPending, startTransition] = useTransition();

  const handleBackup = () => {
    console.log("backup");
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleBackup}
      className="flex gap-2 items-center"
    >
      {isPending && <ReloadIcon className="animate-spin" />}
      {isPending ? "正在备份" : "完整备份"}
    </Button>
  );
}
