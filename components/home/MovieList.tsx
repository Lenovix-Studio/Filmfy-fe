"use client";

import React, { useRef } from "react";
import { Film } from "lucide-react";
import { Movie } from "@/lib/types";
import Pagination from "@/components/Pagination";
import MovieCard from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";

export interface MovieListProps {
  movies: Movie[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  emptyTitle = "Tidak ada film yang ditemukan",
  emptyDescription = "Coba kata kunci lain atau ubah filter status.",
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const cols = 4;
  const rows = Math.ceil(movies.length / cols);

  const virtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400,
    overscan: 2,
  });
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Film className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-slate-700 text-base font-semibold">{emptyTitle}</p>
        <p className="text-slate-500 text-sm mt-1">{emptyDescription}</p>
      </div>
    );
  }


  return (
    <>
      <div ref={parentRef} className="overflow-auto" style={{ height: "calc(100vh - 200px)" }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const startIdx = virtualRow.index * cols;
            const items = movies.slice(startIdx, startIdx + cols);
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: `${virtualRow.start}px`,
                  left: 0,
                  width: "100%",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {items.map((movie, idx) => (
                  <MovieCard key={movie.id} movie={movie} priority={idx === 0} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default MovieList;
