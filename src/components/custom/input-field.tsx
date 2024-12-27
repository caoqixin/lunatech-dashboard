import React from "react";
import { Label } from "../ui/label";

interface InputFieldProps {
  label: string;
  children: React.ReactNode;
}

export const InputField = ({ label, children }: InputFieldProps) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label className="font-semibold text-lg">{label}:</Label>
      <div className="flex items-center w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors dark:border-slate-800 cursor-pointer">
        {children}
      </div>
    </div>
  );
};
