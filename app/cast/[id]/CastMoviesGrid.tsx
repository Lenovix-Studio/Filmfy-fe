"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Film, LayoutGrid, RectangleHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieItem {
  id: string;
  code: string;
  title: string;
  censorship_code?: string | null;
  images?: { file_path: string; image_type: string }[];
}

interface CastMoviesGridProps {
  movies: MovieItem[];
  storageUrl: string;
}

export default function CastMoviesGrid({
  movies,
  storageUrl,
}: CastMoviesGridProps) {
  // Support landscape cover vs portrait cover toggle
  const [aspectMode, setAspectMode] = useState<"landscape" | "portrait">(
    "landscape",
  );

  const formatUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const clean = path.startsWith("/") ? path.slice(1) : path;
    if (!storageUrl) return `/${clean}`;
    return `${storageUrl}/${clean}`;
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Film className="text-indigo-400" size={24} />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Film yang Diperankan{" "}
            <span className="text-sm font-normal text-slate-400 ml-2">
              ({movies.length})
            </span>
          </h2>
        </div>

        {/* Aspect Ratio Toggle: Landscape vs Portrait */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setAspectMode("landscape")}
            className={`rounded-lg text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              aspectMode === "landscape"
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <RectangleHorizontal size={15} />
            Landscape Cover
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setAspectMode("portrait")}
            className={`rounded-lg text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              aspectMode === "portrait"
                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <LayoutGrid size={14} />
            Portrait (3:4)
          </Button>
        </div>
      </div>

      <div
        className={
          aspectMode === "landscape"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        }
      >
        {movies.map((movie) => {
          const coverImg =
            movie.images?.find((img) => img.image_type === "cover") ||
            movie.images?.[0];
          const coverUrl = coverImg ? formatUrl(coverImg.file_path) : null;

          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
            >
              <div
                className={`w-full bg-slate-950 relative overflow-hidden ${
                  aspectMode === "landscape" ? "aspect-video" : "aspect-3/4"
                }`}
              >
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={movie.title || movie.code}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                    <Film size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-600/90 rounded text-white backdrop-blur-sm">
                    Lihat Detail
                  </span>
                </div>
              </div>

              <div className="p-3 flex flex-col justify-between flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                    {movie.code}
                  </span>
                  {movie.censorship_code &&
                    movie.censorship_code.toUpperCase() !== "UNKNOWN" && (
                      <span
                        className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border uppercase ${
                          movie.censorship_code
                            .toUpperCase()
                            .includes("UNCENSORED")
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {movie.censorship_code}
                      </span>
                    )}
                </div>
                <h3 className="text-xs md:text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-white transition-colors">
                  {movie.title || "Tanpa Judul"}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
