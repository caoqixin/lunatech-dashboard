"use client";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import XinStep, { STEP } from "./xin-step";
import { Separator } from "@/components/ui/separator";
import { FieldName, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RepairFormValue } from "@/schemas/repair-schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "@/components/ui/multi-select";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useProblem } from "@/lib/fetcher/use-problem";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createRepair } from "@/lib/actions/server/repairs";

type formType = typeof useForm<RepairFormValue>;

interface XinStepFormProps {
  steps: STEP[];
  form: ReturnType<formType>;
}

const statuses = ["未维修", "维修中", "已维修"];

export default function XinStepForm({ steps, form }: XinStepFormProps) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const problem = useProblem("repair_problem");
  const [isPending, startTransition] = useTransition();

  const prev = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  const next = async (e: FormEvent) => {
    e.preventDefault();

    const fields = steps[currentStep].fields;

    const output = await form.trigger(fields as FieldName<formType>[], {
      shouldFocus: true,
    });

    if (!output) return;
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const onProblemChange = (value: any, data: string[]) => {
    form.setValue(value, data);
  };

  const onSubmit = async (values: RepairFormValue) => {
    startTransition(async () => {
      const data = await createRepair(values);

      if (data.status === "success") {
        toast({
          title: data.msg,
        });
        router.push("/dashboard/repairs");
        form.reset();
      } else {
        toast({
          title: data.msg,
          variant: "destructive",
        });
      }
    });
  };

  const renderContent = (step: number) => {
    if (step === 0) {
      return (
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>客户名称</FormLabel>
                <FormControl>
                  <Input placeholder="客户名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>联系方式</FormLabel>
                <FormControl>
                  <Input placeholder="联系方式" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机型号</FormLabel>
                <FormControl>
                  <Input placeholder="手机型号" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 pt-2">
                <FormLabel>维修故障</FormLabel>
                <MultiSelect
                  defaultValues={field.value}
                  placeholder="维修故障"
                  fieldName="problem"
                  options={problem?.data}
                  setField={onProblemChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>维修状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="维修状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>订金</FormLabel>
                <FormControl>
                  <Input placeholder="订金" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>价格</FormLabel>
                <FormControl>
                  <Input placeholder="价格" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium border-b-2">客人资料</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>客户名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="客户名称"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>联系方式</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="联系方式"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="邮箱" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium border-b-2">维修信息</h3>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机型号</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="手机型号"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 pt-2">
                  <FormLabel>维修故障</FormLabel>
                  <MultiSelect
                    defaultValues={field.value}
                    placeholder="维修故障"
                    fieldName="problem"
                    options={problem?.data}
                    setField={onProblemChange}
                    disabled={isPending}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>维修状态</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="维修状态" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status, index) => (
                        <SelectItem key={index} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>订金</FormLabel>
                  <FormControl>
                    <Input placeholder="订金" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>价格</FormLabel>
                  <FormControl>
                    <Input placeholder="价格" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <XinStep steps={steps} currentStep={currentStep} />
      <Separator />

      <ScrollArea className="h-[calc(80vh-200px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
            {/* steps  starts*/}
            {currentStep === 0 && renderContent(0)}
            {currentStep === 1 && renderContent(1)}
            {currentStep === 2 && renderContent(2)}
            {/*  steps end  */}
            <div className="mt-8 pt-5">
              <div className="flex justify-between">
                {currentStep === 0 ? (
                  <div></div>
                ) : (
                  <Button
                    type="button"
                    onClick={prev}
                    variant="outline"
                    disabled={isPending}
                  >
                    上一步
                  </Button>
                )}
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex gap-2 items-center"
                  >
                    {isPending && <ReloadIcon className="animate-spin" />}
                    完成
                  </Button>
                ) : (
                  <Button type="button" onClick={next} variant="outline">
                    下一步
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </>
  );
}
