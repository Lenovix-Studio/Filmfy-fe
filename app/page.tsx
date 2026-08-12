"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Film,
  Search,
  Heart,
  Upload,
  Settings,
  CheckCircle2,
  Bookmark,
  Trash2,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

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

      {/* ────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT                                                   */}
      {/* ────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Filter Toolbar */}
        <div className="flex items-center gap-3 border-b border-border pb-3 overflow-x-auto scrollbar-none">
          <span className="text-sm font-medium text-muted-foreground shrink-0">
            Filter:
          </span>
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-auto"
          >
            <TabsList className="bg-muted/50">
              {filterTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background data-[state=active]:text-rose-500"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Movie Grid */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-base font-medium">
              Tidak ada film yang ditemukan
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              Coba kata kunci lain atau ubah filter status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-black/40 flex flex-col h-full bg-card">
                  {/* Poster Box */}
                  <div className="relative aspect-2/3 w-full bg-muted overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badges on Top Image */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                      {/* Status Badge */}
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-md text-[10px] gap-1 px-2 py-0.5 border-border/50 font-semibold"
                      >
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
                      </Badge>

                      {/* Rating */}
                      {movie.rating && (
                        <Badge
                          variant="secondary"
                          className="bg-background/80 backdrop-blur-md text-[10px] gap-1 px-2 py-0.5 border-border/50 font-bold text-amber-400"
                        >
                          <Star className="w-3 h-3 fill-amber-400" />
                          {movie.rating}
                        </Badge>
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
                  <CardContent className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-card-foreground group-hover:text-rose-500 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-base font-mono text-muted-foreground mt-1 uppercase tracking-wider">
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
