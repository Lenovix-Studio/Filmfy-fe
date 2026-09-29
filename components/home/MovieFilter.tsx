"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface FilterTabItem {
  id: string;
  label: string;
}

export interface MovieFilterProps {
  tabs: FilterTabItem[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const MovieFilter: React.FC<MovieFilterProps> = ({
  tabs,
  activeFilter,
  onFilterChange,
  label = "Filter:",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-3 border-b border-slate-200/80 pb-3 overflow-x-auto scrollbar-none ${className}`}
    >
      {label && (
        <span className="text-sm font-medium text-slate-500 shrink-0">
          {label}
        </span>
      )}
      <Tabs
        value={activeFilter}
        onValueChange={onFilterChange}
        className="w-auto"
      >
        <TabsList className="bg-slate-100/80 p-1 rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-lg text-xs font-semibold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default MovieFilter;
