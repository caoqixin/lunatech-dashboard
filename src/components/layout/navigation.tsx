"use client";
import { cn } from "@/lib/utils";
import { routes } from "@/route/routes";
import { useNavigationStore } from "@/store/use-navigation-store";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

export const Navigation = () => {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const setTitle = useNavigationStore((state) => state.setTitle);

  return (
    <ul className="flex flex-col gap-1">
      {routes.map((item) => {
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              setTitle(item.title);
            }}
          >
            <span
              className={cn(
                "flex items-center rounded-md gap-2 px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                (segment ? segment === item.label : pathname === item.href)
                  ? "bg-accent"
                  : "bg-transparent",
                "cursor-pointer"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </ul>
  );
};
