"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CampaignProgressProps } from "@/types/campaign";

export function CampaignProgress({ 
  currentStep, 
  totalSteps, 
  stepTitles, 
  onStepClick 
}: CampaignProgressProps) {
  return (
    <div className="w-full">
      {/* Desktop Progress */}
      <div className="hidden md:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          const isClickable = onStepClick && (isCompleted || step === currentStep);

          return (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isClickable && onStepClick(step)}
                  disabled={!isClickable}
                  className={cn(
                    "relative h-12 w-12 rounded-full p-0 transition-all duration-200",
                    isActive && "bg-blue-600 text-white hover:bg-blue-700",
                    isCompleted && "bg-green-600 text-white hover:bg-green-700",
                    !isActive && !isCompleted && "bg-slate-200 text-slate-600 hover:bg-slate-300",
                    isClickable && "cursor-pointer",
                    !isClickable && "cursor-not-allowed opacity-60"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </Button>

                {/* Step Label */}
                <div className="ml-3 min-w-0">
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-blue-600",
                    isCompleted && "text-green-600", 
                    !isActive && !isCompleted && "text-slate-600"
                  )}>
                    {stepTitles[index]}
                  </p>
                  <p className="text-xs text-slate-500">
                    Step {step} of {totalSteps}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {step < totalSteps && (
                <div className={cn(
                  "mx-4 h-px w-16 transition-colors",
                  step < currentStep ? "bg-green-300" : "bg-slate-300"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {stepTitles[currentStep - 1]}
            </p>
            <p className="text-xs text-slate-500">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold",
            "bg-blue-600 text-white"
          )}>
            {currentStep}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }, (_, index) => {
            const step = index + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;

            return (
              <Circle
                key={step}
                className={cn(
                  "h-2 w-2 transition-colors",
                  isActive && "text-blue-600 fill-current",
                  isCompleted && "text-green-600 fill-current",
                  !isActive && !isCompleted && "text-slate-300 fill-current"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
