"use client";

import { cn } from "@/lib/utils";
import { Route } from "@/route/routes";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

interface DashboardNavProps {
  routes: Route[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const DashboardNav = ({ routes, setOpen }: DashboardNavProps) => {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const router = useRouter();

  console.log(segment);

  if (!routes?.length) {
    return null;
  }

  return (
    <nav className="flex flex-col gap-2">
      {routes.map((route) => {
        if (route.href) {
          return (
            <Link key={route.id} href={route.href}>
              <span
                className={cn(
                  "flex items-center rounded-md gap-2 px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  (segment ? segment === route.label : pathname === route.href)
                    ? "bg-accent"
                    : "bg-transparent",
                  "cursor-pointer"
                )}
              >
                {route.icon}
                <span>{route.title}</span>
              </span>
            </Link>
          );
        } else {
          return (
            <Button
              key={route.id}
              className="mt-3 gap-2"
              onClick={() => router.push("/login")}
            >
              {route.icon}
              <span>{route.title}</span>
            </Button>
          );
        }
      })}
    </nav>
  );
};

export default DashboardNav;
