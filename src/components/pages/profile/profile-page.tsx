import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserInfoForm from "./user-info-form";
import { getUser } from "@/lib/user";
import ProfileSection from "./profile-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModifyPassword from "./modify-password-form";
import { ProfilePhoto } from "./profile-photo";

export default async function ProfilePage() {
  const { user } = await getUser();

  const username = user?.user_metadata.name as string;
  const imageUrl = user?.user_metadata.image as string;

  const data = {
    name: username,
  };
  return (
    <Card className="w-full h-full flex flex-col items-center text-center p-5">
      <CardHeader className="flex items-center w-full">
        <CardTitle>
          <ProfilePhoto imageUrl={imageUrl} alt={username} />
        </CardTitle>
        <CardDescription>{user?.email}</CardDescription>
      </CardHeader>
      <ScrollArea className="w-full">
        <CardContent className=" flex flex-col gap-10 py-2 my-2">
          <ProfileSection label="用户信息">
            <UserInfoForm initialData={data} />
          </ProfileSection>
          <ProfileSection label="修改密码">
            <ModifyPassword />
          </ProfileSection>
          {/* <ProfileSection label="账户安全">
            <UserInfoForm initialData={data} />
          </ProfileSection> */}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
