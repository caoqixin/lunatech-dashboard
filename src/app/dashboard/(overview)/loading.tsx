"use client";

import { Loader } from "lucide-react";

export default function Error() {
  return (
    <div className="h-screen flex flex-1 flex-col items-center justify-center p-10">
      <Loader className="size-8 animate-spin text-primary" />
    </div>
  );
}
