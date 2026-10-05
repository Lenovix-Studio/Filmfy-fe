"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { toast } from "sonner";
import { FavoriteMovie } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface FavoritesClientProps {
  initialFavorites: FavoriteMovie[];
}

type SortOption = "LATEST" | "RATING_DESC" | "TITLE_ASC";

export default function FavoritesClient({
  initialFavorites,
}: FavoritesClientProps) {
  const [favoriteMovies, setFavoriteMovies] =
    useState<FavoriteMovie[]>(initialFavorites);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("LATEST");

  const handleRemoveFavorite = async (id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/movies/${id}/favorite`, {
        method: "POST",
      });

      if (res.ok) {
        setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== id));
        toast.success("Dihapus dari favorit");
      } else {
        toast.error("Gagal menghapus dari favorit");
      }
    } catch (error) {
      console.error("Remove favorite failed:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const filteredMovies = favoriteMovies
    .filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.code.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "TITLE_ASC") return a.title.localeCompare(b.title);
      return (
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    });

  const formatPosterUrl = (posterUrl: string | null) => {
    if (!posterUrl) return "/placeholder-poster.webp";
    const cleanPath = posterUrl.replace(/^\//, "");
    return `${STORAGE_URL}/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      <Header
        center={
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari film favorit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 bg-slate-100/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-rose-500 focus-visible:bg-white transition-all w-full"
            />
          </div>
        }
        right={
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 shadow-sm">
              <span>Total:</span>
              <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-200 border-none font-bold px-2 py-0.5 rounded-md">
                {favoriteMovies.length}
              </Badge>
            </div>

            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-48 h-9 border-slate-200/80 rounded-xl text-xs font-medium bg-white shadow-sm hover:bg-slate-50 focus:ring-rose-500/30">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <SelectValue placeholder="Urutkan" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg">
                <SelectItem
                  value="LATEST"
                  className="text-xs focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
                >
                  Terbaru
                </SelectItem>
                <SelectItem
                  value="TITLE_ASC"
                  className="text-xs focus:bg-slate-100 focus:text-slate-900 cursor-pointer"
                >
                  Judul (A - Z)
                </SelectItem>
              </SelectContent>
            </Select>
            <Link href="/settings" title="Pengaturan">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50 shadow-sm">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-full mb-3">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-slate-800 text-base font-semibold">
              Belum ada film favorit
            </p>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              {searchQuery
                ? "Tidak ada film yang cocok dengan kata kunci pencarian kamu."
                : "Tandai film dengan ikon hati di halaman utama untuk memasukkannya ke sini."}
            </p>
            <Link
              href="/"
              className="mt-5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white transition-colors shadow-sm"
            >
              Jelajahi Semua Film
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-rose-300 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 flex flex-col"
              >
                <div className="relative aspect-2/3 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={formatPosterUrl(movie.posterUrl)}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <button
                    onClick={() => handleRemoveFavorite(movie.id)}
                    title="Hapus dari favorit"
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white shadow-md transition-all active:scale-90"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>

                  <button
                    onClick={() => handleRemoveFavorite(movie.id)}
                    title="Hapus dari favorit"
                    className="absolute top-2.5 left-2.5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-900 text-white shadow-md transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <p className="text-[11px] font-mono font-semibold text-rose-600 tracking-wider uppercase mb-1">
                      {movie.code}
                    </p>
                    <Link href={`/movie/${movie.id}`}>
                      <h3 className="font-semibold text-xs text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-2 leading-relaxed hover:underline">
                        {movie.title}
                      </h3>
                    </Link>
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
