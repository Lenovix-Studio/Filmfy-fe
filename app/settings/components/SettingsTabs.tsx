"use client";

import React from "react";
import { Code2, SlidersHorizontal } from "lucide-react";
import { SettingsTabType } from "@/lib/types";

export interface SettingsTabsProps {
  activeTab: SettingsTabType;
  onTabChange: (tab: SettingsTabType) => void;
  className?: string;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit border border-slate-200 ${className}`}
    >
      <button
        type="button"
        onClick={() => onTabChange("common_code")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          activeTab === "common_code"
            ? "bg-white text-rose-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
        }`}
      >
        <Code2 className="w-4 h-4" />
        <span>Common Code</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("other")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          activeTab === "other"
            ? "bg-white text-rose-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Other</span>
      </button>
    </div>
  );
};

export default SettingsTabs;
