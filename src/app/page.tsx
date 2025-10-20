import { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/server/user";
import { InfoPage } from "@/views/info-price/components/info-page";

export const runtime = "edge";

export default async function RootPage() {
  if (!(await isLoggedIn())) {
    redirect("/welcome");
  }

  return <InfoPage />;
}

export const metadata: Metadata = {
  title: "报价平台",
};
