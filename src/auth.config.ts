import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credential from "next-auth/providers/credentials";
import { loginSchema } from "@/schemas/login-schema";
import { getUserByEmail } from "@/lib/user";

export default {
  providers: [
    Credential({
      async authorize(credentials) {
        const validatedData = loginSchema.safeParse(credentials);

        if (validatedData.success) {
          const { email, password } = validatedData.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
