"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UserImage, userImageSchema } from "@/views/auth/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form, FormField } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserAvatar } from "@/views/auth/api/user";
import { useUser } from "@/store/use-user";

interface UserAvatarProps {
  avatar: string;
}

export const UserAvatar = ({ avatar }: UserAvatarProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const updateAvatarSrc = useUser((state) => state.updateAvatarSrc);

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UserImage>({
    resolver: zodResolver(userImageSchema),
    defaultValues: {
      image: avatar,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    form.reset({
      image: avatar,
    });
  }, [avatar]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }

    // 清空 input 的 value 以确保重复上传同一文件时触发 onChange
    e.target.value = "";
  };

  const onSubmit = async (values: UserImage) => {
    try {
      const file = values.image as File;

      const path = `${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setErrorMessage(
          `头像上传失败, 图片格式错误, 请重试 失败原因: ${uploadError.message}`
        );
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      const { msg, status } = await updateUserAvatar(data.publicUrl);
      if (status == "success") {
        toast.success(msg);
        updateAvatarSrc(data.publicUrl);
        router.refresh();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("上传过程中发生错误");
    }
  };

  const handleCancel = () => {
    form.setValue("image", avatar);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isNewImage = (field: { value: string | File }) =>
    Boolean(field.value && field.value instanceof File);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="flex flex-col items-center gap-4">
              {field.value ? (
                <div className="size-28 relative my-3 rounded-full overflow-hidden border-4 border-primary/10 shadow-md transition-all hover:shadow-lg">
                  <Image
                    alt="用户头像"
                    fill
                    className="object-cover rounded-full"
                    src={
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value
                    }
                  />
                </div>
              ) : (
                <Avatar className="size-28 border-4 border-primary/10 shadow-md">
                  <AvatarFallback className="bg-primary/5 text-primary">
                    <ImageIcon className="size-10" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col items-center gap-2">
                <input
                  className="hidden"
                  type="file"
                  accept=".jpg, .png, .jpeg, .svg"
                  ref={inputRef}
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  disabled={isSubmitting}
                  variant="outline"
                  className="flex gap-2 transition-all"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  上传头像
                </Button>
                {field.value && field.value instanceof File && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex gap-2"
                    >
                      <Save className="size-4" /> 保存
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isSubmitting}
                      size="sm"
                      className="flex gap-2"
                      onClick={handleCancel}
                    >
                      <X className="size-5" />
                      取消
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        />
      </form>
    </Form>
  );
};
