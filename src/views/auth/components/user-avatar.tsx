"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { UserImage, userImageSchema } from "@/views/auth/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Loader, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserAvatar } from "@/views/auth/api/user";
import { useUser } from "@/store/use-user";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  initialAvatarUrl?: string | null;
}

export const UserAvatar = ({ initialAvatarUrl }: UserAvatarProps) => {
  // const router = useRouter();
  const supabase = useRef(createClient());
  // Get update function and current avatar from store
  const { avatar: storeAvatar, updateAvatarSrc } = useUser((state) => ({
    avatar: state.avatar,
    updateAvatarSrc: state.updateAvatarSrc,
  }));

  // State for the source URL to *display* in the AvatarImage
  const [displaySrc, setDisplaySrc] = useState<string | null>(
    initialAvatarUrl ?? storeAvatar ?? null
  );
  // State to track if a local file is currently being previewed
  const [isPreviewing, setIsPreviewing] = useState(false);
  // State for image loading (browser loading the preview)
  const [isImageLoading, setIsImageLoading] = useState(false);
  // Transition for API upload/update
  const [isUploading, startUploadTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  // Store the initial/saved URL separately for cancellation
  const savedImageUrl = useRef<string | null>(
    initialAvatarUrl ?? storeAvatar ?? null
  );

  const form = useForm<UserImage>({
    resolver: zodResolver(userImageSchema),
    defaultValues: {
      image: savedImageUrl.current ?? undefined,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isDirty },
  } = form;
  const watchedImage = watch("image");

  // Effect to sync with external changes (prop or store) if component is NOT dirty
  useEffect(() => {
    const externalUrl = initialAvatarUrl ?? storeAvatar ?? null;
    if (!isDirty) {
      savedImageUrl.current = externalUrl;
      setDisplaySrc(externalUrl); // Update display if not dirty
      reset({ image: externalUrl ?? undefined }); // Reset form value too
    }
  }, [initialAvatarUrl, storeAvatar, reset, isDirty]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过 5MB");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setValue("image", file, { shouldValidate: true, shouldDirty: true });
      setIsPreviewing(true); // Indicate we are now showing a local preview
      setIsImageLoading(true); // Start image loading state

      // Generate object URL for immediate preview
      const objectUrl = URL.createObjectURL(file);
      console.log("Generated preview URL:", objectUrl); // Debug
      setDisplaySrc(objectUrl); // Set display source immediately
    }

    // 清空 input 的 value 以确保重复上传同一文件时触发 onChange
    e.target.value = "";
  };

  // Handle image loading completion or error for the preview
  const handleImageLoad = () => {
    // console.log("Preview image loaded:", displaySrc); // Debug
    setIsImageLoading(false);
  };
  const handleImageError = () => {
    // console.error("Preview image failed to load:", displaySrc);
    setIsImageLoading(false);
    toast.error("无法预览所选图片。");
    handleCancel(); // Revert if preview fails
  };

  const handleCancel = useCallback(() => {
    const resetUrl = savedImageUrl.current; // Revert to the last saved URL
    reset({ image: resetUrl ?? undefined });
    setDisplaySrc(resetUrl ?? null);
    setIsPreviewing(false); // No longer previewing
    setIsImageLoading(false); // Stop loading indicator
    if (inputRef.current) inputRef.current.value = "";
  }, [reset]);

  const onSubmit = async (values: UserImage) => {
    startUploadTransition(async () => {
      if (!(values.image instanceof File)) {
        // This case might happen if user clicks save without changing after removing
        toast.info("未选择新头像文件。");
        handleCancel(); // Reset to original state
        return;
      }

      const file = values.image;
      const filePath = file.name;
      const client = supabase.current;

      try {
        // 1. Upload to Supabase Storage
        const { error: uploadError } = await client.storage
          .from("avatars") // Ensure 'avatars' bucket exists and has policies
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError; // Throw to be caught below

        // 2. Get Public URL
        const { data: urlData } = client.storage
          .from("avatars")
          .getPublicUrl(filePath);

        const newAvatarUrl = urlData?.publicUrl;

        if (!newAvatarUrl) throw new Error("无法获取头像 URL。");

        // 3. Update User Metadata in Supabase Auth
        const { msg, status } = await updateUserAvatar(newAvatarUrl);

        if (status == "success") {
          toast.success(msg || "头像更新成功！");
          // 4. Update Zustand Store IMMEDIATELY for instant UI update
          updateAvatarSrc(newAvatarUrl);
          savedImageUrl.current = newAvatarUrl;

          // 5. Reset form state after successful update
          reset({ image: newAvatarUrl }); // Update default value to new URL
          setIsPreviewing(false);
        } else {
          toast.error(msg);
        }
      } catch (error) {
        toast.error(`头像处理失败: ${(error as Error).message || "未知错误"}`);
        handleCancel();
      }
    });
  };

  const isLoading = isUploading || isImageLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-3"
      >
        <div className="relative">
          {/* Container for Avatar and Loader */}
          <Avatar
            className={cn(
              "size-28 rounded-full border-4 border-background shadow-lg bg-muted",
              isLoading && "opacity-50" // Dim avatar while loading
            )}
          >
            {/* Use displaySrc for AvatarImage */}
            <AvatarImage
              src={displaySrc ?? undefined} // Pass undefined if null
              alt="当前头像"
              className="object-cover"
              onLoad={handleImageLoad} // Handle browser image load complete
              onError={handleImageError} // Handle browser image load error
            />
            <AvatarFallback className="rounded-full">
              <ImageIcon className="size-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
              <Loader className="size-8 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <FormField
          control={control}
          name="image"
          render={() => (
            <FormItem className="hidden">
              <FormControl>
                <Input
                  type="file"
                  ref={inputRef}
                  accept=".jpg,.jpeg,.png,.svg,.webp"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 h-9">
          {/* Fixed height container */}
          {!isPreviewing ? ( // Show only upload button initially
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-1.5 size-4" /> 上传头像
            </Button>
          ) : (
            // Show Save/Cancel when previewing
            <>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !isDirty}
                className="min-w-[70px]"
              >
                {isUploading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {isUploading ? "" : "保存"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isUploading}
              >
                <X className="size-4" /> 取消
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};
