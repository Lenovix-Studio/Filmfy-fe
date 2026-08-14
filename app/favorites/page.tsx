"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Film,
  ArrowLeft,
  Heart,
  Search,
  Star,
  CheckCircle2,
  Bookmark,
  Trash2,
  SlidersHorizontal,
  Upload,
  Settings,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Movie {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  rating?: number;
  status: "WATCHED" | "WATCHLIST" | "DELETED";
  isFavorite: boolean;
  addedAt: string;
}

// Dummy Data untuk Favorit
const INITIAL_FAVORITES: Movie[] = [
  {
    id: "1",
    code: "ABC-123",
    title: "Inception",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
    rating: 9.0,
    status: "WATCHED",
    isFavorite: true,
    addedAt: "2026-07-20",
  },
  {
    id: "2",
    code: "XYZ-001",
    title: "Interstellar",
    posterUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60",
    rating: 8.7,
    status: "WATCHED",
    isFavorite: true,
    addedAt: "2026-08-01",
  },
  {
    id: "5",
    code: "BLD-2049",
    title: "Blade Runner 2049",
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60",
    rating: 8.8,
    status: "WATCHED",
    isFavorite: true,
    addedAt: "2026-06-15",
  },
];

type SortOption = "LATEST" | "RATING_DESC" | "TITLE_ASC";

export default function FavoritesPage() {
  const [favoriteMovies, setFavoriteMovies] =
    useState<Movie[]>(INITIAL_FAVORITES);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("LATEST");

  // Toggle remove from favorite
  const handleRemoveFavorite = (id: string) => {
    setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  // Filter & Sort Logic
  const filteredMovies = favoriteMovies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.code.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "RATING_DESC") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "TITLE_ASC") return a.title.localeCompare(b.title);
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-rose-500 selection:text-white">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        leftMode="back"
        rightActions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Badge Total Favorit */}
            <div className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200/80 text-xs font-medium text-neutral-700 shadow-sm">
              <span>Total Favorit:</span>
              <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-200 border-none font-bold px-2 py-0.5 rounded-md">
                {favoriteMovies.length}
              </Badge>
            </div>

            {/* Dropdown Sorting */}
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-48 h-9 border-neutral-200/80 rounded-xl text-xs font-medium text-white shadow-sm hover:bg-neutral-50 focus:ring-rose-500/30">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <SelectValue placeholder="Urutkan" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-200 text-neutral-800 shadow-lg">
                <SelectItem
                  value="LATEST"
                  label="Terbaru"
                  className="text-xs focus:bg-neutral-100 focus:text-neutral-900 cursor-pointer"
                >
                  Terbaru
                </SelectItem>
                <SelectItem
                  value="RATING_DESC"
                  label="Rating Tertinggi"
                  className="text-xs focus:bg-neutral-100 focus:text-neutral-900 cursor-pointer"
                >
                  Rating Tertinggi
                </SelectItem>
                <SelectItem
                  value="TITLE_ASC"
                  label="Judul (A - Z)"
                  className="text-xs focus:bg-neutral-100 focus:text-neutral-900 cursor-pointer"
                >
                  Judul (A - Z)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Favorites Grid */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-neutral-300 rounded-2xl bg-white shadow-sm">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-full mb-3">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-neutral-800 text-base font-semibold">
              Belum ada film favorit
            </p>
            <p className="text-neutral-500 text-sm mt-1 max-w-sm">
              {searchQuery
                ? "Tidak ada film yang cocok dengan kata kunci pencarian kamu."
                : "Tandai film dengan ikon hati di halaman utama untuk memasukkannya ke sini."}
            </p>
            <Link
              href="/"
              className="mt-5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-white transition-colors shadow-sm"
            >
              Jelajahi Semua Film
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:border-rose-300 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 flex flex-col"
              >
                {/* Poster Box / Cover */}
                <div className="relative aspect-2/3 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Quick Remove Favorite Button */}
                  <button
                    onClick={() => handleRemoveFavorite(movie.id)}
                    title="Hapus dari favorit"
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white shadow-md transition-all active:scale-90"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>

                {/* Details Box: Hanya Code & Title */}
                <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <p className="text-[11px] font-mono font-semibold text-rose-600 tracking-wider uppercase mb-1">
                      {movie.code}
                    </p>
                    <h3 className="font-semibold text-xs text-neutral-800 group-hover:text-rose-600 transition-colors line-clamp-2 leading-relaxed">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
