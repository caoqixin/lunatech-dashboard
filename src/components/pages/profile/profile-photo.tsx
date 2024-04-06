"use client";

import { ChangeEvent, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createClient } from "@/lib/supabase/client";
import dayjs from "dayjs";
import { useAvatar } from "@/store/avatar";

const uploadAvatar = async (bucket: string, file: File) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //get extension
  const extension = file.name.split(".").pop()?.toLowerCase();
  const fileName = `public/${user?.user_metadata.name}_avatar.${extension}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      upsert: true,
    });

  if (!error) {
    const imageUrl = supabase.storage.from("avatars").getPublicUrl(data.path);
    const seed = dayjs().unix();
    await supabase.auth.updateUser({
      data: {
        image: `${imageUrl.data.publicUrl}?${seed}`,
      },
    });

    return {
      status: "success",
      msg: `头像更新成功`,
    };
  }

  return {
    status: "error",
    msg: `头像更新失败, 请重试`,
  };
};

interface ProfilePhotoProps {
  imageUrl: string;
  alt: string;
}

export function ProfilePhoto({ imageUrl, alt }: ProfilePhotoProps) {
  const [photo, updatePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(imageUrl);
  const { toast } = useToast();
  const router = useRouter();
  const [pending, startTransaction] = useTransition();
  const updateAvatarSrc = useAvatar((state) => state.updateAvatarSrc);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const showPreview = (file: File) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
    };
  };

  const changePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      updatePhoto(file);

      // show preview
      showPreview(file);
    }
  };

  const onCanel = () => {
    updatePhoto(null);
    setPreview(imageUrl);
  };

  const onConfirm = () => {
    startTransaction(async () => {
      if (photo) {
        const { msg, status } = await uploadAvatar("avatars", photo);

        if (status == "error") {
          toast({
            title: msg,
            variant: "destructive",
          });
        } else {
          toast({
            title: msg,
          });
        }
        if (preview) {
          updateAvatarSrc(preview);
        }
        updatePhoto(null);
      }
    });
    router.refresh();
  };
  return (
    <div className="flex gap-5 max-md:flex-col max-md:items-center">
      {preview ? (
        <Image
          src={preview}
          height={128}
          width={128}
          alt={alt}
          priority={true}
          className="w-24 h-24 border rounded-full object-cover cursor-pointer"
        />
      ) : (
        <div className="w-24 h-24 border rounded-full object-cover cursor-pointer flex justify-center items-center">
          {alt}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Button variant="secondary" onClick={handleClick} disabled={pending}>
          更换头像{" "}
          <Input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={changePhoto}
          />
        </Button>
        {photo && (
          <div className="flex gap-1">
            <Button variant="outline" onClick={onCanel} disabled={pending}>
              取消
            </Button>
            <Button onClick={onConfirm} disabled={pending}>
              {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              确认更换
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
