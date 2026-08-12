"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Heart, Upload, Settings, Search, ArrowLeft } from "lucide-react";

interface NavbarProps {
  // Left
  leftMode?: "logo" | "back";
  backLabel?: string;
  backHref?: string;

  // Middle
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Right
  rightActions?: React.ReactNode;
  extraRightActions?: React.ReactNode;
}

export function Navbar({
  leftMode = "logo",
  backLabel = "Back",
  backHref,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search title or code (e.g. ABC-123)...",
  rightActions,
  extraRightActions,
}: NavbarProps) {
  const router = useRouter();
  const showSearch = searchQuery !== undefined && onSearchChange !== undefined;

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-sm px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo / Back Button */}
        <div className="flex items-center min-w-37.5">
          {leftMode === "logo" ? (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-rose-600 p-2 rounded-xl text-white shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Filmfy
              </span>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              className="gap-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">{backLabel}</span>
            </Button>
          )}
        </div>

        {/* Searchbox */}
        <div className="flex-1 max-w-md mx-auto w-full">
          {showSearch && (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-4 bg-slate-100/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-rose-500 focus-visible:bg-white transition-all w-full"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 min-w-37.5 justify-end">
          {rightActions}
          {extraRightActions}
        </div>
      </div>
    </header>
  );
}
