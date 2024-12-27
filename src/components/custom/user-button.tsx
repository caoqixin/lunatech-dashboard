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
import { useAvatar } from "@/store/avatar";
import { useUser } from "@/store/use-user";
import { logout } from "@/views/auth/api/auth";
import { User } from "@supabase/supabase-js";
import { Loader, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const UserButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const avatar = useUser((state) => state.avatar);
  const userName = useUser((state) => state.userName);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const data = await getCurrentUser();
        if (data) {
          setUser(data);
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      try {
        const data = await getCurrentUser();
        if (data) {
          setUser(data);
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, [avatar, userName]);

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-background">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-background">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { email, name, image } = user.user_metadata;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-muted">
          <AvatarImage src={image} alt={name} className="object-cover" />
          <AvatarFallback className="bg-background font-medium text-foreground flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-[52px] border border-muted">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-background font-medium text-foreground flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-foreground">
              {name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <Separator className="mb-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">个人中心</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">设置</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <Separator className="mb-1" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="h-10 flex items-center justify-center text-destructive font-medium cursor-pointer"
        >
          <LogOut className="size-4 mr-2" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
