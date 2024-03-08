"use client";
import React, { useState } from "react";

export type STEP = {
  id: string | number;
  name: string;
  field?: string[];
};

interface XinStepProps {
  steps: STEP[];
  currentStep: number;
}

const XinStep = ({ steps, currentStep }: XinStepProps) => {
  return (
    <div className="pb-3">
      <ul className="flex gap-4">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            {currentStep > index ? (
              <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-semibold">{step.name}</span>
              </div>
            ) : currentStep === index ? (
              <div
                className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-semibold">{step.name}</span>
              </div>
            ) : (
              <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-semibold">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default XinStep;
