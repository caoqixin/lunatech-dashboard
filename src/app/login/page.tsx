import LoginForm from "@/views/auth/components/login-form";
import { Metadata } from "next";

export default async function Page() {
  return <LoginForm />;
}

export const metadata: Metadata = {
  title: "登录",
};
