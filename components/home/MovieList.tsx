"use client";

import React from "react";
import { Film, Loader2 } from "lucide-react";
import { Movie } from "@/lib/types";
import Pagination from "@/components/Pagination";
import MovieCard from "./MovieCard";

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
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
        <p className="text-slate-500 text-sm font-medium">
          Memuat daftar film...
        </p>
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default MovieList;
