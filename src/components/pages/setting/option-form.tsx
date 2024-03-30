"use client";
import { SettingReturnValue, setting } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Setting } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface OptionFormProps {
  label: string;
  placeholder?: string;
  name: string;
}

const initialData: SettingReturnValue = {
  msg: "",
  status: "",
};

const OptionForm = ({ label, name, placeholder = label }: OptionFormProps) => {
  const settingWithName = setting.bind(null, name);
  const [returnValue, action] = useFormState(settingWithName, initialData);
  const { toast } = useToast();
  const router = useRouter();
  const [option, setOption] = useState<string | null>(null);

  const getOption = async () => {
    try {
      const res = await fetch(`/api/v1/settings/${name}`);

      if (res.ok) {
        const data: Setting = await res.json();
        setOption(data.setting_value);
      }
    } catch (error) {
      setOption(null);
    }
  };

  useEffect(() => {
    getOption();
    if (returnValue.msg !== "") {
      if (returnValue.status == "success") {
        toast({
          title: returnValue.msg,
        });
      } else {
        toast({
          title: returnValue.msg,
          variant: "destructive",
        });
      }
      router.refresh();
    }
  }, [returnValue]);

  return (
    <form action={action}>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor={name} className="text-nowrap">
          {label}:
        </Label>
        <div className="flex gap-2">
          <Input
            id={name}
            name={name}
            className="w-full"
            placeholder={placeholder}
            value={option ?? ""}
            onChange={(e) => setOption(e.target.value)}
          />
          <Button type="submit">保存</Button>
        </div>
      </div>
    </form>
  );
};

export default OptionForm;
