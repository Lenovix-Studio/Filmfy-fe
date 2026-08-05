"use client";

import { useState } from "react";
import {
  Search,
  Heart,
  Upload,
  Film,
  Star,
  Trash2,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

// Types untuk data film
type StatusFilter = "ALL" | "FAVORITE" | "DELETED";

interface Movie {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  rating?: number;
  status: "WATCHED" | "WATCHLIST" | "DELETED";
  isFavorite: boolean;
}

// Dummy Data untuk preview
const INITIAL_MOVIES: Movie[] = [
  {
    id: "1",
    code: "ABC-123",
    title: "Inception",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
    rating: 9.0,
    status: "WATCHED",
    isFavorite: true,
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
  },
  {
    id: "3",
    code: "MOV-042",
    title: "Dune: Part Two",
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60",
    rating: 8.5,
    status: "WATCHLIST",
    isFavorite: false,
  },
  {
    id: "4",
    code: "DEL-999",
    title: "Old Project File (Deleted)",
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60",
    status: "DELETED",
    isFavorite: false,
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");
  const [movies] = useState<Movie[]>(INITIAL_MOVIES);

  // Filter Logic
  const filteredMovies = movies.filter((movie) => {
    // Search match (by title or code)
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.code.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Filter
    if (!matchesSearch) return false;
    if (activeFilter === "ALL") return true;
    if (activeFilter === "FAVORITE") return movie.isFavorite;
    if (activeFilter === "DELETED") return movie.status === "DELETED";

    return true;
  });

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: "ALL", label: "All" },
    { id: "FAVORITE", label: "Favorite" },
    { id: "DELETED", label: "Deleted" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* ────────────────────────────────────────────────────────────── */}
      {/* NAVBAR                                                         */}
      {/* ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-rose-600 p-2 rounded-xl text-white shadow-lg shadow-rose-600/20">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Filmfy
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search title or code (e.g. ABC-123)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-800/80 border border-neutral-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-neutral-200 placeholder-neutral-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveFilter("FAVORITE")}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors text-neutral-300"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span>Favorites</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all active:scale-95">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT                                                   */}
      {/* ────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
          <span className="text-sm font-medium text-neutral-400 mr-2">
            Filter:
          </span>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? "bg-neutral-800 text-rose-400 border border-rose-500/30 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="w-12 h-12 text-neutral-700 mb-3" />
            <p className="text-neutral-400 text-base font-medium">
              Tidak ada film yang ditemukan
            </p>
            <p className="text-neutral-600 text-sm mt-1">
              Coba kata kunci lain atau ubah filter status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 flex flex-col"
              >
                {/* Poster Box */}
                <div className="relative aspect-2/3 w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges on Top Image */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                    {/* Status Badge */}
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

                    {/* Rating */}
                    {movie.rating && (
                      <span className="bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700/50 text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {movie.rating}
                      </span>
                    )}
                  </div>

                  {/* Favorite Indicator */}
                  {movie.isFavorite && (
                    <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-rose-600/90 text-white shadow-md">
                      <Heart className="w-3.5 h-3.5 fill-white" />
                    </div>
                  )}
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
