import { SymbolIcon } from "@radix-ui/react-icons";

export function Loading() {
  return (
    <div className="flex gap-3 items-center justify-center">
      <SymbolIcon className="h-6 w-6 animate-spin" /> Loading...
    </div>
  );
}
