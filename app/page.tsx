"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Film,
  Heart,
  Upload,
  Settings,
  Bookmark,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface ApiMovie {
  id: string;
  code: string;
  title: string;
  coverPath: string | null;
}

type StatusFilter = "ALL" | "FAVORITE" | "WATCHED" | "DELETED";

interface Movie {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  rating?: number;
  status: "ALL" | "FAVORITE" | "WATCHED" | "DELETED";
  isFavorite: boolean;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);

        const BACKEND_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        const res = await fetch(`${BACKEND_URL}/movies`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Response dari server bukan JSON. Pastikan port backend benar.",
          );
        }

        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          const formattedMovies: Movie[] = result.data.map((item: ApiMovie) => {
            const cleanCoverPath = item.coverPath?.replace(/^\//, "");

            return {
              id: item.id,
              code: item.code,
              title: item.title,
              posterUrl: cleanCoverPath
                ? `${BACKEND_URL}/storage/${cleanCoverPath}`
                : "/placeholder-poster.webp",
              status: "DELETED",
              isFavorite: false,
            };
          });

          setMovies(formattedMovies);
        }
      } catch (error) {
        console.error("Gagal mengambil data film:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();
  }, []);

  // Filter Logic
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.code.toLowerCase().includes(searchQuery.toLowerCase());

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-rose-500 selection:text-white">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        extraRightActions={
          <>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl hidden md:flex border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-rose-600"
            >
              <Link href="/favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                <span>Favorites</span>
              </Link>
            </Button>

            <Button
              size="lg"
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
            >
              <Link href="/upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Link href="/settings" title="Pengaturan">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Filter Toolbar */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3 overflow-x-auto scrollbar-none">
          <span className="text-sm font-medium text-slate-500 shrink-0">
            Filter:
          </span>
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-auto"
          >
            <TabsList className="bg-slate-100/80 p-1 rounded-xl">
              {filterTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-lg text-xs font-semibold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Movie Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-3" />
            <p className="text-slate-500 text-sm font-medium">
              Memuat daftar film...
            </p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-700 text-base font-semibold">
              Tidak ada film yang ditemukan
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Coba kata kunci lain atau ubah filter status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <Card className="group relative overflow-hidden transition-all duration-300 bg-white border border-slate-200/80 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 rounded-2xl flex flex-col h-full">
                  {/* Poster Box */}
                  <div className="relative aspect-2/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                      {/* Status Badge */}
                      <Badge
                        variant="secondary"
                        className="bg-white/90 backdrop-blur-md text-[10px] gap-1 px-2 py-0.5 border border-slate-200/60 font-semibold text-slate-700 shadow-xs"
                      >
                        {movie.status === "FAVORITE" && (
                          <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                        )}
                        {movie.status === "DELETED" && (
                          <Trash2 className="w-3 h-3 text-rose-500" />
                        )}
                        {movie.status}
                      </Badge>

                      {/* Rating */}
                      {movie.rating && (
                        <Badge
                          variant="secondary"
                          className="bg-white/90 backdrop-blur-md text-[10px] gap-1 px-2 py-0.5 border border-slate-200/60 font-bold text-amber-600 shadow-xs"
                        >
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {movie.rating}
                        </Badge>
                      )}
                    </div>

                    {/* Favorite Indicator */}
                    {movie.isFavorite && (
                      <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-rose-600 text-white shadow-md shadow-rose-600/30">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Details Box */}
                  <CardContent className="p-3.5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-wider font-medium">
                        {movie.code}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
