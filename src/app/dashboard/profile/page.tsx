import ProfilePage from "@/components/pages/profile/profile-page";
import { auth } from "@/lib/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "个人中心",
};

export default async function Page() {
  await auth();

  return <ProfilePage />;
}
