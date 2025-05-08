"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator, // 使用 Separator 代替手动 Separator
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getCurrentUser } from "@/server/user"; // 确认路径
import { useUser } from "@/store/use-user"; // 确认路径
import { logout } from "@/views/auth/api/auth"; // 确认路径
import { User } from "@supabase/supabase-js";
import { Loader, LogOut, UserCircle, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

export const UserButton = () => {
  const [isLoading, setIsLoading] = useState(true); // 初始化为 true，避免闪烁
  const [user, setUser] = useState<User | null>(null);

  // 从 Zustand store 获取可能更新的信息
  const avatar = useUser((state) => state.avatar);
  const userName = useUser((state) => state.userName);

  // 获取用户数据
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const data = await getCurrentUser();
        if (isMounted && data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted) setUser(null); // 出错时清空 user
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    }; // 清理函数
  }, []); // 初始加载时获取

  // 监听 store 变化，如果 user 存在，尝试合并信息 (可选优化)
  useEffect(() => {
    // Only proceed if user data has already been loaded initially
    if (user) {
      setUser((prevUser) => {
        // Should always have prevUser if user is not null, but check anyway
        if (!prevUser) return prevUser;

        const currentMeta = prevUser.user_metadata || {};
        let metadataChanged = false;
        const newMeta = { ...currentMeta }; // Create copy to potentially modify

        // Check and update avatar if needed
        if (avatar && newMeta.image !== avatar) {
          newMeta.image = avatar;
          metadataChanged = true;
        }
        // Check and update name if needed
        if (userName && newMeta.name !== userName) {
          newMeta.name = userName;
          metadataChanged = true;
        }

        if (metadataChanged) {
          // console.log(
          //   "UserButton: Syncing store changes to local state",
          //   newMeta
          // );
          return { ...prevUser, user_metadata: newMeta };
        } else {
          // If no change, return the previous state object reference
          return prevUser;
        }
      });
    }
  }, [avatar, userName]);

  // 计算显示的具体信息
  const userDetails = useMemo(() => {
    if (!user) return null;

    const { email = "", name = "", image = "" } = user.user_metadata || {};
    // 优先使用 metadata 中的 name，其次是 store 中的 userName，最后是 "用户"
    const displayName = name || userName || "用户";
    // 优先使用 metadata 中的 image，其次是 store 中的 avatar
    const avatarSrc = image || avatar || "";
    // Fallback 逻辑保持不变
    const fallback =
      displayName.charAt(0).toUpperCase() ||
      (email ? email.charAt(0).toUpperCase() : "") ||
      "U";

    return { email, displayName, avatarSrc, fallback };
  }, [user, avatar, userName]);

  // --- 渲染逻辑 ---

  // 加载状态: 显示一个与 Avatar 大小一致的骨架
  if (isLoading) {
    return (
      <div className="flex size-9 items-center justify-center rounded-full bg-muted">
        {/* 尺寸改为 size-9 (36px) */}
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 未登录或无法获取用户信息的状态 (userDetails 为 null)
  if (!userDetails) {
    // 可以选择显示一个默认图标或登录按钮，这里暂时返回 null 或一个占位符
    // return null;
    // 或者显示一个默认的未登录头像
    return (
      <Avatar className="size-9 cursor-default bg-muted">
        <AvatarFallback className="text-muted-foreground">
          <UserCircle className="size-5" />
        </AvatarFallback>
      </Avatar>
    );
  }

  // 正常显示用户按钮和下拉菜单
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* 触发器：用户头像 */}
        <button className="relative flex size-9 shrink-0 overflow-hidden rounded-full transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <Avatar className="size-full border">
            {/* 尺寸 size-full 继承 button */}
            <AvatarImage
              src={userDetails.avatarSrc}
              alt={userDetails.displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {userDetails.fallback}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      {/* 下拉菜单内容 */}
      <DropdownMenuContent
        align="end"
        // 稍微减小宽度，使用标准阴影和边框圆角
        className="w-60 rounded-lg border bg-popover p-1 shadow-lg"
        sideOffset={8} // 调整偏移
      >
        {/* 顶部用户信息区域 */}
        <div className="flex items-center gap-3 p-2">
          <Avatar className="size-10">
            {/* 内部头像稍小 */}
            <AvatarImage
              src={userDetails.avatarSrc}
              alt={userDetails.displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 font-medium text-primary">
              {userDetails.fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            {/* 使用标准 space-y */}
            <p className="truncate text-sm font-medium leading-none text-foreground">
              {userDetails.displayName}
            </p>
            <p className="truncate text-xs leading-none text-muted-foreground">
              {userDetails.email || "无邮箱信息"} {/* 处理无邮箱情况 */}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator /> {/* 使用内置分隔符 */}
        {/* 菜单项组 */}
        <DropdownMenuGroup>
          {/* DropdownMenuItem 默认就有 hover 效果和圆角 */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard/profile" className="flex items-center">
              {/* 图标颜色改为 muted-foreground，更柔和 */}
              <UserCircle className="mr-2 size-4 text-muted-foreground" />
              <span>个人中心</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard/settings" className="flex items-center">
              <Settings className="mr-2 size-4 text-muted-foreground" />
              <span>系统设置</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* 退出登录项 */}
        <DropdownMenuItem
          onClick={() => logout()} // 假设 logout 函数处理跳转和状态清理
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
