"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";

import { ImageIcon, Loader } from "lucide-react";
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
import {
  Brand as BrandType,
  BrandSchema,
} from "@/views/brand/schema/brand.schema";
import { updateBrand } from "@/views/brand/api/brand";
import { createClient } from "@/lib/supabase/client";
import type { Brand } from "@/lib/types";
import { ResponsiveModal } from "@/components/custom/responsive-modal";

interface UpdateBrandProps {
  brand: Brand;
  triggerButton: React.ReactNode; // Expect trigger
  onSuccess?: () => void; // Success callback
}

export const UpdateBrand = ({
  brand,
  triggerButton,
  onSuccess,
}: UpdateBrandProps) => {
  const [open, setOpen] = useState(false);
  const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>(
    brand?.brand_image ?? undefined
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl ?? null
  );
  const supabase = createClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BrandType>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: brand?.name ?? "",
      brand_image: initialImageUrl,
    },
  });

  const {
    formState: { isSubmitting, isDirty },
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
  } = form;

  // Update preview
  const watchedImage = watch("brand_image");
  useEffect(() => {
    let objectUrl: string | null = null;
    if (watchedImage instanceof File) {
      objectUrl = URL.createObjectURL(watchedImage);
      setPreviewUrl(objectUrl);
    } else if (typeof watchedImage === "string" && watchedImage) {
      setPreviewUrl(watchedImage); // Existing URL string
    } else {
      setPreviewUrl(null); // No image or undefined
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [watchedImage]);

  // Reset form when brand prop changes or modal closes without save
  useEffect(() => {
    const imageUrl = brand?.brand_image ?? undefined;
    if (brand && !isSubmitting) {
      // Only reset if not submitting
      form.reset({ name: brand.name ?? "", brand_image: imageUrl });
      setInitialImageUrl(imageUrl); // Update initial URL tracker
      setPreviewUrl(imageUrl ?? null);
    }
  }, [brand, form.reset, isSubmitting, open]);

  const handleModalChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    // Reset logic moved to useEffect dependent on 'open'
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过 5MB");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setValue("brand_image", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleRemoveImage = () => {
    setValue("brand_image", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (values: BrandType) => {
    // Only submit if form is dirty (data changed)
    if (!isDirty) {
      handleModalChange(false);
      return;
    }

    let imageUrl: string | undefined = initialImageUrl; // Start with initial
    let uploadError = null;
    const imageChanged = values.brand_image !== initialImageUrl;

    // Handle image upload/removal ONLY if it actually changed
    if (imageChanged) {
      if (values.brand_image instanceof File) {
        const file = values.brand_image;
        const filePath = `public/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("brand")
          .upload(filePath, file, { upsert: true });
        if (error) {
          uploadError = error;
        } else {
          const { data: urlData } = supabase.storage
            .from("brand")
            .getPublicUrl(filePath);
          imageUrl = urlData?.publicUrl;
        }
      } else {
        // If it's not a File and changed, it means it was removed
        imageUrl = undefined; // Explicitly null to potentially clear in DB
        // TODO: Optionally delete the old image from Supabase storage here if imageUrl was previously set
      }
    }

    if (uploadError) {
      toast.error(`图标上传失败: ${uploadError.message}`);
      return;
    }

    const apiData = { ...values, brand_image: imageUrl ?? "" }; // Send URL or null

    try {
      const { msg, status } = await updateBrand(apiData, brand.id);
      if (status === "success") {
        toast.success(msg);
        handleModalChange(false);
        onSuccess?.();
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error("更新品牌失败，请稍后重试。");
      console.error("Update Brand API error:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("brand_image", file);
    }
    // 清空 input 的 value 以确保重复上传同一文件时触发 onChange
    e.target.value = "";
  };

  useEffect(() => {
    form.reset({
      name: brand.name,
      brand_image: brand.brand_image ?? "",
    });
  }, [brand]);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={handleModalChange}
      triggerButton={triggerButton}
      title={`修改品牌: ${brand?.name}`}
      dialogClassName="sm:max-w-md"
      showMobileFooter={false}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-1 pb-2">
          {/* Image Upload Section - similar to Create */}
          <FormItem>
            <FormLabel>品牌图标 (可选)</FormLabel>
            <div className="flex items-center gap-4 pt-1">
              <Avatar className="size-16 rounded-md border bg-muted">
                {previewUrl ? (
                  <AvatarImage
                    src={previewUrl}
                    alt="预览"
                    className="object-contain"
                  />
                ) : (
                  <AvatarFallback className="rounded-md">
                    {" "}
                    <ImageIcon className="size-6 text-muted-foreground" />{" "}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  {" "}
                  更改图片{" "}
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
                    {" "}
                    移除图片{" "}
                  </Button>
                )}
                <FormDescription className="text-xs">
                  {" "}
                  Max 5MB.{" "}
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  type="file"
                  ref={inputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.svg,.webp"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </div>
            <FormMessage>
              {form.formState.errors.brand_image?.message?.toString()}
            </FormMessage>
          </FormItem>

          {/* Brand Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>品牌名称 *</FormLabel>{" "}
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>{" "}
                <FormMessage />{" "}
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
              disabled={isSubmitting || !isDirty}
              className="min-w-[90px]"
            >
              {isSubmitting && <Loader className="mr-2 size-4 animate-spin" />}
              保存修改
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
