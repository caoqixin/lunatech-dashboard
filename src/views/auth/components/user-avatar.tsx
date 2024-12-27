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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }

    // 清空 input 的 value 以确保重复上传同一文件时触发 onChange
    e.target.value = "";
  };

  const form = useForm<UserImage>({
    resolver: zodResolver(userImageSchema),
    defaultValues: {
      image: avatar,
    },
  });

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: UserImage) => {
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
  };

  useEffect(() => {
    form.reset({
      image: avatar,
    });
  }, [avatar]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 space-y-2"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-center gap-x-5">
                {field.value ? (
                  <div className="size-24 relative my-3 rounded-md overflow-hidden">
                    <Image
                      alt="Logo"
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
                  <Avatar className="size-16">
                    <AvatarFallback>
                      <ImageIcon className="size-8" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col">
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
                    className="w-fit mt-2 flex gap-2"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="size-5" />
                    上传头像
                  </Button>
                  {field.value && field.value instanceof File && (
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-fit mt-2 flex gap-2"
                      >
                        <Save className="size-5" /> 保存
                      </Button>
                      <Button
                        variant="destructive"
                        type="button"
                        disabled={isSubmitting}
                        className="w-fit mt-2 flex gap-2"
                        onClick={() => {
                          form.setValue("image", avatar);
                          if (inputRef.current) {
                            inputRef.current.value = ""; // 清空文件输入的值
                          }
                        }}
                      >
                        <X className="size-5" />
                        取消
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        />
      </form>
    </Form>
  );
};
