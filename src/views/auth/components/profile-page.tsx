import { getCurrentUser } from "@/views/auth/api/user";
import { redirect } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { Separator } from "@/components/ui/separator";
import { UserInfo } from "./user-info";
import { ModifyPasswordField } from "./modify-password-field";

export const ProfilePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { name, image } = user.user_metadata;

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-center">
        <UserAvatar avatar={image} />
      </div>
      <p className="flex justify-center text-muted-foreground text-2xl">
        {user.email}
      </p>
      <Separator className="my-4" />
      <UserInfo userName={name} />
      <Separator className="my-4" />
      <ModifyPasswordField />
    </div>
  );
};
