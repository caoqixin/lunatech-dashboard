import { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/server/user";
import { InfoPage } from "@/views/info-price/components/info-page";

export default async function Home() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return <InfoPage />;
}

export const metadata: Metadata = {
  title: "报价平台",
};
