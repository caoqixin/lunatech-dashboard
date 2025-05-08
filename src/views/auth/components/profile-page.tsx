import { getCurrentUser } from "@/views/auth/api/user";
import { redirect } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { Separator } from "@/components/ui/separator";
import { UserInfo } from "./user-info";
import { ModifyPasswordField } from "./modify-password-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

interface UserMetadata {
  name?: string | null;
  image?: string | null;
}

type UserWithMetadata = User & {
  user_metadata: UserMetadata;
};

export const ProfilePage = async () => {
  const user = (await getCurrentUser()) as UserWithMetadata | null;

  if (!user) {
    redirect("/login");
  }

  const initialName = user.user_metadata?.name ?? user.email ?? "用户";

  const initialAvatar = user.user_metadata?.image ?? undefined;

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden shadow-lg dark:border-border/50">
        <CardHeader className="bg-muted/30 p-6 text-center">
          <CardTitle className="text-2xl font-semibold">个人资料</CardTitle>
          <CardDescription>管理你的账户信息和安全设置。</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="flex flex-col items-center border-b pb-6">
            <UserAvatar initialAvatarUrl={initialAvatar} />
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {user.email}
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-1">个人信息</h3>
              <Separator className="mb-4" />
              <UserInfo initialUserName={initialName} />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-1">安全设置</h3>
              <Separator className="mb-4" />
              <ModifyPasswordField />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
