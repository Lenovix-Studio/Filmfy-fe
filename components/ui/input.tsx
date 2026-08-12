import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Base layout & Typography
        "h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base md:text-sm transition-colors outline-none select-text",
        // Light theme colors & borders
        "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400",
        // Hover & Focus states
        "hover:border-slate-400 focus-visible:border-rose-500 focus-visible:ring-1 focus-visible:ring-rose-500/20",
        // File input styling
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-900",
        // Disabled state
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200",
        // Validation / Invalid state
        "aria-invalid:border-rose-500 aria-invalid:ring-3 aria-invalid:ring-rose-500/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
