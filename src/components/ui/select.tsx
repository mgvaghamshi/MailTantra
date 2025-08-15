import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none opacity-50" />
  </div>
));
Select.displayName = "Select";

const SelectValue = ({ placeholder }: { placeholder?: string }) => null;
const SelectContent = ({ children }: { children: React.ReactNode }) => children;
const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, children, ...props }, ref) => (
  <option
    className={cn("relative flex cursor-default select-none items-center", className)}
    ref={ref}
    {...props}
  >
    {children}
  </option>
));
SelectItem.displayName = "SelectItem";
const SelectTrigger = Select;

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
