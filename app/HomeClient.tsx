"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Upload, Settings, Search } from "lucide-react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Movie } from "@/lib/types";
import MovieList from "@/components/home/MovieList";
import MovieFilter from "@/components/home/MovieFilter";

interface HomeClientProps {
  initialMovies: Movie[];
  initialFilterTabs: { id: string; label: string }[];
}

export default function HomeClient({
  initialMovies,
  initialFilterTabs,
}: HomeClientProps) {
  const ITEMS_PER_PAGE = 8;
  const [movies] = useState<Movie[]>(initialMovies);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovies = movies.filter((movie) => {
    const titleMatch = (movie?.title || "")
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase());
    const codeMatch = (movie?.code || "")
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase());
    const matchesSearch = titleMatch || codeMatch;

    if (!matchesSearch) return false;
    if (activeFilter === "ALL") return true;
    if (activeFilter === "FAVORITE" && movie?.isFavorite) return true;
    return movie?.status === activeFilter;
  });

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMovies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        center={
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari film atau series..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 bg-slate-100/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-rose-500 focus-visible:bg-white transition-all w-full"
            />
          </div>
        }
        right={
          <div className="gap-2 flex items-center">
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
      <div className="bg-background text-foreground font-sans selection:bg-rose-500 selection:text-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-3 space-y-6">
          <MovieFilter
            tabs={initialFilterTabs}
            activeFilter={activeFilter}
            onFilterChange={(val) => {
              setActiveFilter(val);
              setCurrentPage(1);
            }}
          />

          <MovieList
            movies={paginatedMovies}
            isLoading={false}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </>
  );
}
