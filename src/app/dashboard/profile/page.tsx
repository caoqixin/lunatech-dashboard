import { isLoggedIn } from "@/server/user";
import { ProfilePage } from "@/views/auth/components/profile-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "个人中心",
};

export default async function Page() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return <ProfilePage />;
}
