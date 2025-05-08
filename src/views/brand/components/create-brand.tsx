"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImageIcon, Loader, PlusIcon } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Brand, BrandSchema } from "@/views/brand/schema/brand.schema";
import { createNewBrand } from "@/views/brand/api/brand";
import { createClient } from "@/lib/supabase/client";

interface CreateBrandProps {
  onSuccess?: () => void;
}

export const CreateBrand = ({ onSuccess }: CreateBrandProps) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For image preview
  const supabase = createClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<Brand>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      brand_image: undefined,
    },
  });

  const {
    formState: { isSubmitting },
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
  } = form;

  // Watch the image field for preview updates
  const watchedImage = watch("brand_image");

  useEffect(() => {
    let objectUrl: string | null = null;
    if (watchedImage instanceof File) {
      objectUrl = URL.createObjectURL(watchedImage);
      setPreviewUrl(objectUrl);
    } else if (typeof watchedImage === "string" && watchedImage) {
      setPreviewUrl(watchedImage); // Could be existing URL in edit mode maybe?
    } else {
      setPreviewUrl(null);
    }
    // Cleanup function to revoke the object URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [watchedImage]);

  const handleModalChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        reset({ name: "", brand_image: undefined }); // Reset form and preview on close
        setPreviewUrl(null);
      }
    },
    [reset]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size client-side (example: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过 5MB");
        if (inputRef.current) inputRef.current.value = ""; // Clear input
        return;
      }
      setValue("brand_image", file, {
        shouldValidate: true,
        shouldDirty: true,
      }); // Set File object
    }
  };

  const handleRemoveImage = () => {
    setValue("brand_image", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = ""; // Clear input
  };

  const onSubmit = async (values: Brand) => {
    let imageUrl: string | undefined = undefined;
    let uploadError = null;

    if (values.brand_image instanceof File) {
      const file = values.brand_image;
      // Simple path using name + timestamp to avoid collisions
      const filePath = `public/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("brand") // Bucket name
        .upload(filePath, file, { upsert: true }); // Use filePath

      if (error) {
        uploadError = error;
      } else {
        const { data: urlData } = supabase.storage
          .from("brand")
          .getPublicUrl(filePath);
        imageUrl = urlData?.publicUrl;
        // console.log("Public URL:", imageUrl); // Debug log
      }
    } else if (typeof values.brand_image === "string" && values.brand_image) {
      // Handle case where it might already be a URL (less likely for create)
      imageUrl = values.brand_image;
    }

    if (uploadError) {
      toast.error(`图标上传失败: ${uploadError.message}`);
      return; // Stop submission if upload fails
    }

    // Prepare data for API (replace File with URL or undefined)
    const apiData = { ...values, brand_image: imageUrl };

    try {
      const { msg, status } = await createNewBrand(apiData);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false); // Close modal
        onSuccess?.(); // Trigger refresh
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("创建品牌失败，请稍后重试。");
      console.error("Create Brand API error:", error);
    }
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={
        <Button size="sm" className="text-xs md:text-sm">
          <PlusIcon className="mr-1.5 h-4 w-4" /> 新增品牌
        </Button>
      }
      title="添加新品牌"
      dialogClassName="sm:max-w-md"
      showMobileFooter={false}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-1 pb-2">
          {/* Image Upload Section */}
          <FormItem>
            <FormLabel>品牌图标 (可选)</FormLabel>
            <div className="flex items-center gap-4 pt-1">
              {/* Preview */}
              <Avatar className="size-16 rounded-md border bg-muted">
                {" "}
                {/* Use rounded-md for square logo? */}
                {previewUrl ? (
                  <AvatarImage
                    src={previewUrl}
                    alt="品牌图标预览"
                    className="object-contain"
                  /> // object-contain
                ) : (
                  <AvatarFallback className="rounded-md">
                    {" "}
                    <ImageIcon className="size-6 text-muted-foreground" />{" "}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Controls */}
              <div className="flex flex-col space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  选择图片
                </Button>
                {previewUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive hover:text-destructive"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                  >
                    移除图片
                  </Button>
                )}
                <FormDescription className="text-xs">
                  {" "}
                  Max 5MB. JPG, PNG, SVG.{" "}
                </FormDescription>
              </div>
              {/* Hidden File Input */}
              <FormControl>
                <Input
                  type="file"
                  ref={inputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.svg,.webp" // Accept webp too
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </div>
            <FormMessage>
              {form.formState.errors.brand_image?.message?.toString()}
            </FormMessage>
          </FormItem>

          {/* Brand Name Input */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>品牌名称 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="例如：Apple, Samsung"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleModalChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[90px]"
            >
              {isSubmitting ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : null}
              添加
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
