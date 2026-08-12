"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentProps<"label"> {
  required?: boolean;
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        // Layout & Typography Base
        "flex items-center text-sm font-medium leading-none select-none",
        // Light Theme Color
        "text-slate-800",
        // Disabled States
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-rose-600 font-bold" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export { Label };
