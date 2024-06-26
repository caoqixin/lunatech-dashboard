import Link from "next/link";
import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";
import { ModeToggle } from "../mode-toggle";
import { getUser } from "@/lib/user";

const Header = async () => {
  const { user } = await getUser();

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href="/dashboard" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Luna Tech
          </Link>
        </div>

        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-4">
          <UserAvatar user={user} />
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
};

export default Header;
