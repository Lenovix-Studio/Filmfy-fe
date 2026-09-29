import React, { ReactNode } from "react";
import Link from "next/link";
import { Film, Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  left?: ReactNode | boolean;
  center?: ReactNode | boolean;
  right?: ReactNode | boolean;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  left,
  center,
  right,
  onSearchChange,
  searchPlaceholder = "Cari film atau series...",
  className = "",
}) => {
  const renderLeft = () => {
    if (left === false) return null;
    if (left !== undefined && left !== true) return left;

    return (
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="bg-rose-600 p-2 rounded-xl text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
          <Film className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Filmfy
        </span>
      </Link>
    );
  };

  const renderCenter = () => {
    if (center === false) return null;
    if (center !== undefined && center !== true) return center;

    return (
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9 pr-4 bg-slate-100/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-rose-500 focus-visible:bg-white transition-all w-full"
        />
      </div>
    );
  };

  const renderRight = () => {
    if (right === false) return null;
    if (right !== undefined && right !== true) return right;

    return (
      <Button
        size="lg"
        className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
      >
        <Link href="/upload" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </Link>
      </Button>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3 transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-[40]">
        <div className="flex items-center shrink-0">{renderLeft()}</div>
        <div className="flex-1 flex justify-center px-2">{renderCenter()}</div>
        <div className="flex items-center shrink-0">{renderRight()}</div>
      </div>
    </header>
  );
};

export default Header;
