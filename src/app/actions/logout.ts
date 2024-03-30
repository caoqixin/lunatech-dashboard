"use server";

import { signOut } from "@/auth";

export async function logoutUser() {
  await signOut();
}
