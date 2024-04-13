"use client";
import { Button } from "@/components/ui/button";
import { ReloadIcon, UploadIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MouseEvent, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { importFromUrl } from "@/lib/actions/import";
import { useRouter } from "next/navigation";

export default function ImportBrand() {
  const [isUrl, setIsUrl] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [open, setOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { toast } = useToast();

  const onImport = async (e: MouseEvent) => {
    e.preventDefault();
    setIsImporting(true);
    // 如果已经选择类型
    if (isSelect) {
      // url
      if (isUrl) {
        if (urlRef.current) {
          const url = urlRef.current.value;

          const res = await importFromUrl(url);
          if (res.status == "error") {
            // 如果失败
            toast({
              variant: "destructive",
              title: res.msg,
            });
            setIsImporting(false);
          } else {
            toast({
              title: res.msg,
            });

            resetAllStatus();
            setOpen(false);
            setIsImporting(false);
            router.refresh();
          }
        }
      }

      // 本地
      if (isLocal) {
        if (fileRef.current) {
          const file = fileRef.current.files;
          console.log(file);
        }
      }
    }
  };

  const resetAllStatus = () => {
    setIsLocal(false);
    setIsUrl(false);
    setIsSelect(false);
  };

  const onCancel = (e: MouseEvent) => {
    e.preventDefault();
    if (isSelect) {
      resetAllStatus();
    }
  };

  const onUrl = (e: MouseEvent) => {
    e.preventDefault();

    setIsUrl(true);
    setIsSelect(true);
  };

  const onLocal = (e: MouseEvent) => {
    e.preventDefault();

    setIsLocal(true);
    setIsSelect(true);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UploadIcon /> 导入
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={resetAllStatus}
        onEscapeKeyDown={resetAllStatus}
      >
        <DialogHeader>
          <DialogTitle>导入手机品牌和机型数据</DialogTitle>
          <DialogDescription>选择导入的方式</DialogDescription>
        </DialogHeader>
        {!isSelect && (
          <div className="grid gap-4 py-4">
            <Button onClick={onUrl}>URL 导入</Button>
            <Button onClick={onLocal}>本地导入</Button>
          </div>
        )}
        {isUrl && (
          <div className="grid gap-2 py-4">
            <Input
              ref={urlRef}
              id="url"
              placeholder="输入url网址"
              type="url"
              required
            />

            <Button
              onClick={onImport}
              className="flex items-center gap-2"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <ReloadIcon className="animate-spin" /> 正在导入, 请稍等
                </>
              ) : (
                "导入"
              )}
            </Button>
          </div>
        )}
        {isLocal && (
          <div className="grid gap-2 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">文件</Label>
              <Input ref={fileRef} id="file" type="file" accept=".csv" />
            </div>
            <Button
              onClick={onImport}
              className="flex items-center gap-2"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <ReloadIcon className="animate-spin" /> 正在导入, 请稍等
                </>
              ) : (
                "导入"
              )}
            </Button>
          </div>
        )}
        {isSelect && (
          <Button type="button" onClick={onCancel}>
            取消
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
