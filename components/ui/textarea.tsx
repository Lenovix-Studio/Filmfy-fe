import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base Layout & Typography
        "flex field-sizing-content min-h-16 w-full rounded-lg px-3 py-2 text-base md:text-sm transition-all outline-none resize-y",
        // Light Theme Styling (Background, Text, Border & Placeholder)
        "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-xs",
        // Focus State
        "focus-visible:border-rose-500 focus-visible:ring-1 focus-visible:ring-slate-800/20",
        // Disabled State
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:opacity-70",
        // Invalid State (Error validation)
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
