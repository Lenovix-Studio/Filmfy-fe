"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  ArrowLeft,
  Heart,
  Star,
  CheckCircle2,
  Bookmark,
  Trash2,
  Calendar,
  Clock,
  Tag,
  Share2,
  Pencil,
  RotateCcw,
} from "lucide-react";

interface MovieDetail {
  id: string;
  code: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  rating?: number;
  status: "WATCHED" | "WATCHLIST" | "DELETED";
  isFavorite: boolean;
  releaseYear: number;
  durationMinutes: number;
  genres: string[];
  synopsis: string;
  watchedAt?: string;
}

// Dummy detail data generator (dapat diganti fetch API / Zustand store)
const MOCK_MOVIES: Record<string, MovieDetail> = {
  "1": {
    id: "1",
    code: "ABC-123",
    title: "Inception",
    originalTitle: "Inception (2010)",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    rating: 9.0,
    status: "WATCHED",
    isFavorite: true,
    releaseYear: 2010,
    durationMinutes: 148,
    genres: ["Sci-Fi", "Action", "Thriller"],
    synopsis:
      "Seorang pencuri mahir yang mencuri rahasia berharga dari dalam alam bawah sadar seseorang saat berada dalam kondisi mimpi diberi tugas yang hampir mustahil: menanamkan sebuah ide ke dalam pikiran seorang CEO.",
    watchedAt: "15 Juli 2026",
  },
  "2": {
    id: "2",
    code: "XYZ-001",
    title: "Interstellar",
    posterUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    rating: 8.7,
    status: "WATCHED",
    isFavorite: true,
    releaseYear: 2014,
    durationMinutes: 169,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    synopsis:
      "Ketika Bumi tak lagi mampu menopang kehidupan manusia, sekelompok penjelajah menggunakan lubang cacing untuk melampaui batas perjalanan antarbintang dan menemukan planet baru yang layak huni.",
    watchedAt: "2 Agustus 2026",
  },
};

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Load movie data or fallback default
  const initialMovie = MOCK_MOVIES[resolvedParams.id] || {
    id: resolvedParams.id,
    code: `MOV-${resolvedParams.id}`,
    title: `Film #${resolvedParams.id}`,
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
    rating: 8.0,
    status: "WATCHLIST",
    isFavorite: false,
    releaseYear: 2024,
    durationMinutes: 120,
    genres: ["Drama"],
    synopsis: "Sinopsis tidak tersedia untuk film ini.",
  };

  const [movie, setMovie] = useState<MovieDetail>(initialMovie);
  const [copied, setCopied] = useState(false);

  // Toggle Favorite
  const handleToggleFavorite = () => {
    setMovie((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  // Change Status
  const handleChangeStatus = (
    newStatus: "WATCHED" | "WATCHLIST" | "DELETED",
  ) => {
    setMovie((prev) => ({ ...prev, status: newStatus }));
  };

  // Copy share link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-rose-600 selection:text-white">
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="bg-rose-600 p-1.5 rounded-lg text-white shadow-lg shadow-rose-600/20">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">Filmfy</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Banner Backdrop (opsional) */}
        {movie.backdropUrl && (
          <div className="relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden border border-neutral-800">
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover filter brightness-50"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          </div>
        )}

        {/* Layout Grid Utama */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Poster & Quick Action (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="relative aspect-2/3 w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />

              {/* Badges di atas poster */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-neutral-950/80 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full border border-neutral-700/50 text-neutral-200 flex items-center gap-1.5">
                  {movie.status === "WATCHED" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {movie.status === "WATCHLIST" && (
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {movie.status === "DELETED" && (
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  {movie.status}
                </span>

                {movie.rating && (
                  <span className="bg-neutral-950/80 backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-full border border-neutral-700/50 text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {movie.rating} / 10
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  movie.isFavorite
                    ? "bg-rose-950/40 border-rose-500/60 text-rose-300"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    movie.isFavorite ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                <span>
                  {movie.isFavorite ? "Favorit Kamu" : "Tambah ke Favorit"}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{copied ? "Tersalin!" : "Bagikan"}</span>
                </button>

                <button
                  onClick={() =>
                    alert("Fitur edit dapat dihubungkan ke form /upload")
                  }
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail Informasi Film (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            {/* Header Title & Code */}
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-rose-400 bg-rose-950/40 border border-rose-900/40 px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold">
                  {movie.code}
                </span>
                {movie.watchedAt && (
                  <span className="text-xs text-neutral-500">
                    Ditonton pada: {movie.watchedAt}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                {movie.title}
              </h1>

              {movie.originalTitle && (
                <p className="text-sm text-neutral-400 mt-1 italic">
                  {movie.originalTitle}
                </p>
              )}
            </div>

            {/* Meta Tags: Tahun, Durasi, Genre */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 border-y border-neutral-800 py-3.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span>{movie.releaseYear}</span>
              </div>

              <span className="text-neutral-700">•</span>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span>{movie.durationMinutes} Menit</span>
              </div>

              <span className="text-neutral-700">•</span>

              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-neutral-500" />
                <div className="flex items-center gap-1.5">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Sinopsis
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-xl">
                {movie.synopsis}
              </p>
            </div>

            {/* Pengubah Status Film */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Ubah Status Koleksi
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleChangeStatus("WATCHED")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                    movie.status === "WATCHED"
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Watched</span>
                </button>

                <button
                  onClick={() => handleChangeStatus("WATCHLIST")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                    movie.status === "WATCHLIST"
                      ? "bg-amber-950/40 border-amber-500 text-amber-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Watchlist</span>
                </button>

                <button
                  onClick={() => handleChangeStatus("DELETED")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                    movie.status === "DELETED"
                      ? "bg-rose-950/40 border-rose-500 text-rose-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Deleted</span>
                </button>
              </div>

              {/* Opsi khusus jika status Deleted */}
              {movie.status === "DELETED" && (
                <div className="mt-3 p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-rose-300">
                    Film ini ada di kategori Deleted.
                  </span>
                  <button
                    onClick={() => handleChangeStatus("WATCHED")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pulihkan Film</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
