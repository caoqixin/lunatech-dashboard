"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/server/user";
import { useUser } from "@/store/use-user";
import { logout } from "@/views/auth/api/auth";
import { User } from "@supabase/supabase-js";
import { Loader, LogOut, UserCircle, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

export const UserButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const avatar = useUser((state) => state.avatar);
  const userName = useUser((state) => state.userName);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const data = await getCurrentUser();
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [avatar, userName]);

  const userDetails = useMemo(() => {
    if (!user) return null;

    const { email = "", name = "", image = "" } = user.user_metadata || {};
    const displayName = name || userName || "User";
    const avatarSrc = image || avatar || "";
    const fallback =
      displayName.charAt(0).toUpperCase() ||
      email.charAt(0).toUpperCase() ||
      "U";

    return { email, displayName, avatarSrc, fallback };
  }, [user, avatar, userName]);

  if (isLoading || !userDetails) {
    return (
      <div className="size-10 rounded-full flex-center bg-secondary">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-80 transition-all-normal border border-border shadow-sm">
          <AvatarImage
            src={userDetails.avatarSrc}
            alt={userDetails.displayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-secondary font-medium text-secondary-foreground flex-center">
            {userDetails.fallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-64 p-0 overflow-hidden shadow-md"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-5 bg-card">
          <Avatar className="size-16 border-2 border-primary/10 shadow-sm">
            <AvatarImage
              src={userDetails.avatarSrc}
              alt={userDetails.displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 font-medium text-primary flex-center">
              {userDetails.fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center spacing-y">
            <p className="text-sm font-semibold text-foreground">
              {userDetails.displayName}
            </p>
            <p className="text-xs text-muted-foreground">{userDetails.email}</p>
          </div>
        </div>
        <Separator className="h-px bg-border" />

        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem
            asChild
            className="flex items-center h-10 px-3 cursor-pointer rounded-md transition-all-normal"
          >
            <Link
              href="/dashboard/profile"
              className="flex w-full items-center"
            >
              <UserCircle className="size-4 mr-2 text-primary" />
              <span>个人中心</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="flex items-center h-10 px-3 cursor-pointer rounded-md transition-all-normal"
          >
            <Link
              href="/dashboard/settings"
              className="flex w-full items-center"
            >
              <Settings className="size-4 mr-2 text-primary" />
              <span>设置</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Separator className="h-px bg-border" />
        <div className="p-1">
          <DropdownMenuItem
            onClick={logout}
            className="flex items-center justify-center h-10 px-3 cursor-pointer rounded-md text-destructive font-medium hover:bg-destructive/10 transition-all-normal"
          >
            <LogOut className="size-4 mr-2" />
            退出登录
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
