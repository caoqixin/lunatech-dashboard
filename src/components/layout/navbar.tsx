"use client";
import { useNavigationStore } from "@/store/use-navigation-store";
import { UserButton } from "../custom/user-button";
import { ModeToggle } from "../mode-toggle";
import { MobileSidebar } from "./mobile-sidebar";

interface NavbarProps {
  titleButton?: React.ReactNode;
}

export const Navbar = ({ titleButton }: NavbarProps) => {
  const title = useNavigationStore((state) => state.title);
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-xl">{titleButton || title}</h1>
      </div>
      <MobileSidebar />
      <div className="flex items-center gap-1.5">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
};
