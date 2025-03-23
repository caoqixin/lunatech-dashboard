import { isLoggedIn } from "@/server/user";
import { ProfilePage } from "@/views/auth/components/profile-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// 使用 force-static 强制静态渲染
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "个人中心",
};

export default async function Page() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return <ProfilePage />;
}
