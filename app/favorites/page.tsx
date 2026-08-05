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
} from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-rose-600 selection:text-white">
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 p-1.5 rounded-lg text-white shadow-lg shadow-rose-600/20">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">Filmfy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Film Favorit
              </h1>
            </div>
            <p className="text-neutral-400 text-sm mt-1.5">
              Koleksi film-film terbaik yang paling kamu sukai.
            </p>
          </div>

          {/* Stats Badge */}
          <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
            Total Favorit:{" "}
            <span className="font-bold text-rose-400">
              {favoriteMovies.length}
            </span>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari favorit (judul / kode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-neutral-200 placeholder-neutral-500 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-400">
              Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-medium text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              <option value="LATEST">Terbaru Ditambahkan</option>
              <option value="RATING_DESC">Rating Tertinggi</option>
              <option value="TITLE_ASC">Judul (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/30">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full mb-3">
              <Heart className="w-8 h-8 text-neutral-600" />
            </div>
            <p className="text-neutral-300 text-base font-semibold">
              Belum ada film favorit
            </p>
            <p className="text-neutral-500 text-sm mt-1 max-w-sm">
              {searchQuery
                ? "Tidak ada film yang cocok dengan kata kunci pencarian kamu."
                : "Tandai film dengan ikon hati di halaman utama untuk memasukkannya ke sini."}
            </p>
            <Link
              href="/"
              className="mt-5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-medium text-white transition-colors"
            >
              Jelajahi Semua Film
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-rose-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-rose-950/20 flex flex-col"
              >
                {/* Poster Box */}
                <div className="relative aspect-2/3 w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="bg-neutral-950/80 backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full border border-neutral-700/50 text-neutral-300 flex items-center gap-1">
                      {movie.status === "WATCHED" && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                      {movie.status === "WATCHLIST" && (
                        <Bookmark className="w-3 h-3 text-amber-400" />
                      )}
                      {movie.status === "DELETED" && (
                        <Trash2 className="w-3 h-3 text-rose-400" />
                      )}
                      {movie.status}
                    </span>

                    {movie.rating && (
                      <span className="bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700/50 text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {movie.rating}
                      </span>
                    )}
                  </div>

                  {/* Quick Remove Favorite Button */}
                  <button
                    onClick={() => handleRemoveFavorite(movie.id)}
                    title="Hapus dari favorit"
                    className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-lg transition-all active:scale-90"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>

                {/* Details Box */}
                <div className="p-3.5 flex flex-col flex-1 justify-between bg-neutral-900">
                  <div>
                    <h3 className="font-semibold text-sm text-neutral-100 group-hover:text-rose-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                      {movie.code}
                    </p>
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
