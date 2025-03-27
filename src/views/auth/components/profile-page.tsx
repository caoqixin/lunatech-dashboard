import { getCurrentUser } from "@/views/auth/api/user";
import { redirect } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { Separator } from "@/components/ui/separator";
import { UserInfo } from "./user-info";
import { ModifyPasswordField } from "./modify-password-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";

interface UserMetadata {
  name: string;
  image: string;
}

type UserWithMetadata = User & {
  user_metadata: UserMetadata;
};

export const ProfilePage = async () => {
  const user = (await getCurrentUser()) as UserWithMetadata | null;

  if (!user) {
    redirect("/login");
  }

  const { name, image } = user.user_metadata;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <Card className="shadow-md">
        <CardHeader className="pb-0">
          <CardTitle className="text-center text-2xl font-bold">
            个人资料
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-center">
            <UserAvatar avatar={image} />
            <p className="mt-3 text-muted-foreground text-lg">{user.email}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">个人信息</h3>
              <Separator className="mb-4" />
              <UserInfo userName={name} />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">安全设置</h3>
              <Separator className="mb-4" />
              <ModifyPasswordField />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
