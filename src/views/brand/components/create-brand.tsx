"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ImageIcon, Loader, PlusIcon, X } from "lucide-react";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Brand, BrandSchema } from "@/views/brand/schema/brand.schema";
import Image from "next/image";
import { createNewBrand } from "@/views/brand/api/brand";
import { createClient } from "@/lib/supabase/client";

export const CreateBrand = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<Brand>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      brand_image: "",
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

  const onSubmit = async (values: Brand) => {
    if (values.brand_image) {
      const file = values.brand_image as File;

      const path = `${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("brand")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setErrorMessage(
          `图标上传失败, 图片格式错误, 请重试 失败原因: ${uploadError.message}`
        );
        return;
      }

      const { data } = supabase.storage.from("brand").getPublicUrl(path);

      const finalData = { ...values, brand_image: data.publicUrl };

      const { msg, status } = await createNewBrand(finalData);
      if (status == "success") {
        toast.success(msg);
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(msg);
      }
    } else {
      const { msg, status } = await createNewBrand(values);
      if (status == "success") {
        toast.success(msg);
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(msg);
      }
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

  return (
    <ResponsiveModal
      open={open}
      onOpen={setOpen}
      triggerButton={
        <Button className="text-xs md:text-sm">
          <PlusIcon className="mr-2 h-4 w-4" /> 新增
        </Button>
      }
      title="新品牌"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 space-y-2"
        >
          <FormField
            control={form.control}
            name="brand_image"
            render={({ field }) => (
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-center gap-x-5">
                  {field.value ? (
                    <div className="size-16 relative rounded-md overflow-hidden">
                      <Image
                        alt="Logo"
                        fill
                        className="object-cover"
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
                    <p className="text-sm">品牌图标</p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, SVG OR JPEG, MAX 5MB
                    </p>
                    <input
                      className="hidden"
                      type="file"
                      accept=".jpg, .png, .jpeg, .svg"
                      ref={inputRef}
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                    <div className="flex gap-x-2 items-center">
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        variant="outline"
                        size="sm"
                        className="w-fit mt-2"
                        onClick={() => inputRef.current?.click()}
                      >
                        上传图标
                      </Button>
                      {field.value && (
                        <Button
                          type="button"
                          disabled={isSubmitting}
                          variant="destructive"
                          size="sm"
                          className="w-fit mt-2"
                          onClick={() => {
                            form.setValue("brand_image", "");
                            if (inputRef.current) {
                              inputRef.current.value = ""; // 清空文件输入的值
                            }
                          }}
                        >
                          <X className="size-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mx-2">
                <FormLabel className="text-nowrap min-w-12 text-right">
                  名称
                </FormLabel>
                <div className="flex flex-col gap-1 w-full">
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex gap-2 items-center"
          >
            {isSubmitting && <Loader className="animate-spin" />}
            添加
          </Button>
        </form>
      </Form>
    </ResponsiveModal>
  );
};