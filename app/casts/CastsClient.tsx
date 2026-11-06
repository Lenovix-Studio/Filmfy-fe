"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Film, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CastItem } from "./page";

interface CastsClientProps {
  initialCasts: CastItem[];
  storageUrl: string;
}

export default function CastsClient({
  initialCasts,
  storageUrl,
}: CastsClientProps) {
  const [search, setSearch] = useState("");

  const formatUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${storageUrl}/${clean}`;
  };

  const filteredCasts = initialCasts.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.display_name || "").toLowerCase().includes(q) ||
      (c.other_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama cast atau nama alias..."
          className="pl-9 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl"
        />
      </div>

      {filteredCasts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500">
          <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-medium">Cast tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCasts.map((cast) => {
            const avatarUrl = formatUrl(cast.profile_path);

            return (
              <Link
                key={cast.id}
                href={`/cast/${cast.id}`}
                className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square w-full bg-slate-800 overflow-hidden">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={cast.display_name || cast.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                      <User size={48} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[11px] font-semibold text-white flex items-center gap-1 border border-white/10">
                    <Film size={11} className="text-indigo-400" />
                    <span>{cast.movies_count}</span>
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-1">
                  <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {cast.display_name || cast.name}
                  </h3>
                  {cast.other_name && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {cast.other_name}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
