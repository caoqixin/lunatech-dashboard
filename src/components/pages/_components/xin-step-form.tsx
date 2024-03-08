"use client";
import React, { FormEvent, useEffect, useState } from "react";
import XinStep, { STEP } from "./xin-step";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
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

type formType = typeof useForm<RepairFormValue>;

interface XinStepFormProps {
  steps: STEP[];
  form: ReturnType<formType>;
}

const XinStepForm = ({ steps, form }: XinStepFormProps) => {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(currentStep);
  }, [currentStep]);

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  const next = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const onSubmit = (data: any) => {
    console.log("form");
  };
  return (
    <>
      <XinStep steps={steps} currentStep={currentStep} />
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* steps */}
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
          <div className="mt-8 pt-5">
            <div className="flex justify-between">
              {currentStep === 0 ? (
                <div></div>
              ) : (
                <Button type="button" onClick={prev} variant="outline">
                  上一步
                </Button>
              )}
              {currentStep === steps.length - 1 ? (
                <Button type="submit">完成</Button>
              ) : (
                <Button type="button" onClick={next} variant="outline">
                  下一步
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default XinStepForm;
