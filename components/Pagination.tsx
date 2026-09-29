"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-1.5 pt-4 ${className}`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 h-9 px-2.5"
        title="Halaman Pertama"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 h-9 px-2.5"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
              currentPage === pageNum
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 h-9 px-2.5"
        title="Halaman Selanjutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 h-9 px-2.5"
        title="Halaman Terakhir"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
