import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-background p-4 w-full border-r border-black">
      <Link href="/">
        <p className="text-2xl font-bold">Luna Tech</p>
      </Link>
      <Separator className="my-4" />
      <Navigation />
    </aside>
  );
};
