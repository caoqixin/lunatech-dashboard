"use client";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { STEP } from "../_components/xin-step";
import XinStepForm from "../_components/xin-step-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RepairFormValue, RepairSchema } from "@/schemas/repair-schema";

interface CreateRepairFormProps {}

const CreateRepairForm = ({}: CreateRepairFormProps) => {
  const steps: STEP[] = [
    {
      id: 1,
      name: "用户资料",
      fields: ["name", "tel", "email"],
    },
    {
      id: 2,
      name: "维修信息",
      fields: ["phone", "problem", "status", "deposit", "price"],
    },
    {
      id: 3,
      name: "信息确认",
    },
  ];

  const form = useForm<RepairFormValue>({
    resolver: zodResolver(RepairSchema),
    defaultValues: {
      phone: "",
      problem: [],
      status: "未维修",
      deposit: "0.00",
      price: "0.00",
      name: "",
      tel: "",
      email: "",
    },
    mode: "onChange",
  });

  return (
    <>
      <XinStepForm steps={steps} form={form} />
      {/* <Form>
        <form className="space-y-8 px-1 w-full"></form>
      </Form> */}
    </>
  );
};

export default CreateRepairForm;
