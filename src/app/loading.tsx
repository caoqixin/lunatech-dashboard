"use client";

import { Loader } from "lucide-react";

export default function Error() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader className="size-6 animate-spin" />
    </div>
  );
}
