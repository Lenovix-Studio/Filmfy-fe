"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Film,
  ArrowLeft,
  UploadCloud,
  Star,
  Heart,
  CheckCircle2,
  Bookmark,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

// Schema Validasi dengan Zod
const movieSchema = z.object({
  code: z.string().min(2, "Kode film minimal 2 karakter (misal: ABC-123)"),
  title: z.string().min(1, "Judul film wajib diisi"),
  posterUrl: z.string().url("URL Poster harus berupa URL gambar yang valid"),
  status: z.enum(["WATCHED", "WATCHLIST", "DELETED"]),
  isFavorite: z.boolean(),
  rating: z.number().min(1).max(10).optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

export default function UploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      code: "",
      title: "",
      posterUrl: "",
      status: "WATCHED",
      isFavorite: false,
      rating: 8,
    },
  });

  // Watch fields untuk live preview
  const watchedValues = watch();

  const onSubmit = async (data: MovieFormData) => {
    setIsSubmitting(true);

    // Simulate API Call / Save process
    console.log("Movie Data Saved:", data);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);

    // Redirect kembali ke halaman utama
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header / Navbar Minimalis */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 p-1.5 rounded-lg text-white">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">Filmfy</span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tambah Film Baru
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Isi detail informasi film untuk dimasukkan ke katalog koleksi Filmfy
            kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Input (7 cols) */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 space-y-5 shadow-xl"
          >
            {/* Field Kode & Judul */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Kode Film *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABC-123"
                  {...register("code")}
                  className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all uppercase"
                />
                {errors.code && (
                  <p className="text-rose-500 text-xs mt-1.5">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Judul Film *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inception"
                  {...register("title")}
                  className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                />
                {errors.title && (
                  <p className="text-rose-500 text-xs mt-1.5">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            {/* Poster URL */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                URL Gambar Poster *
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                {...register("posterUrl")}
                className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
              />
              {errors.posterUrl && (
                <p className="text-rose-500 text-xs mt-1.5">
                  {errors.posterUrl.message}
                </p>
              )}
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Status Film
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: "WATCHED",
                    label: "Watched",
                    icon: CheckCircle2,
                    color: "text-emerald-400",
                  },
                  {
                    id: "WATCHLIST",
                    label: "Watchlist",
                    icon: Bookmark,
                    color: "text-amber-400",
                  },
                  {
                    id: "DELETED",
                    label: "Deleted",
                    icon: Trash2,
                    color: "text-rose-400",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = watchedValues.status === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setValue(
                          "status",
                          item.id as "WATCHED" | "WATCHLIST" | "DELETED",
                        )
                      }
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-neutral-800 border-rose-500/60 text-white shadow-sm"
                          : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating & Favorite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Rating Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Rating (1 - 10)
                </label>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    {...register("rating", { valueAsNumber: true })}
                    className="w-24 px-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  />
                  <span className="text-xs text-neutral-500">/ 10</span>
                </div>
              </div>

              {/* Favorite Toggle */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Favoritkan
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setValue("isFavorite", !watchedValues.isFavorite)
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                    watchedValues.isFavorite
                      ? "bg-rose-950/40 border-rose-500 text-rose-300"
                      : "bg-neutral-900/50 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      watchedValues.isFavorite
                        ? "text-rose-500 fill-rose-500"
                        : "text-neutral-500"
                    }`}
                  />
                  <span>
                    {watchedValues.isFavorite
                      ? "Sangat Disukai"
                      : "Tambah ke Favorit"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-neutral-800/80 flex justify-end gap-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isSubmitting ? "Menyimpan..." : "Simpan Film"}</span>
              </button>
            </div>
          </form>

          {/* Real-time Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Pratinjau Kartu Film
            </h2>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden max-w-xs mx-auto lg:max-w-none shadow-2xl">
              <div className="relative aspect-2/3 w-full bg-neutral-950 flex items-center justify-center overflow-hidden">
                {watchedValues.posterUrl ? (
                  <img
                    src={watchedValues.posterUrl}
                    alt={watchedValues.title || "Preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback jika URL gambar eror/rusak
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-600">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-xs font-medium">
                      Belum Ada Poster
                    </span>
                  </div>
                )}

                {/* Badges Preview */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                  <span className="bg-neutral-950/80 backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full border border-neutral-700/50 text-neutral-300 flex items-center gap-1">
                    {watchedValues.status === "WATCHED" && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                    {watchedValues.status === "WATCHLIST" && (
                      <Bookmark className="w-3 h-3 text-amber-400" />
                    )}
                    {watchedValues.status === "DELETED" && (
                      <Trash2 className="w-3 h-3 text-rose-400" />
                    )}
                    {watchedValues.status}
                  </span>

                  {watchedValues.rating && (
                    <span className="bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700/50 text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {watchedValues.rating}
                    </span>
                  )}
                </div>

                {watchedValues.isFavorite && (
                  <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-rose-600/90 text-white shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-neutral-900">
                <h3 className="font-semibold text-sm text-neutral-100 line-clamp-1">
                  {watchedValues.title || "Judul Film"}
                </h3>
                <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                  {watchedValues.code || "KODE-000"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
