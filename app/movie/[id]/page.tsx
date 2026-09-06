import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { notFound } from "next/navigation";

export interface MovieDetailBackend {
  id: string;
  code: string;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  releaseDate: string | null;
  runtimeMinutes: number | null;
  language: string | null;
  country: string | null;
  tmdbId: number | null;
  imdbId: string | null;
  createdAt: string;
  updatedAt: string;
  studios: { id: string; name: string }[];
  series: { id: string; name: string }[];
  labels: { id: string; name: string }[];
  genres: { id: string; name: string }[];
  directors: { id: string; name: string }[];
  casts: { id: string; name: string }[];
  images: {
    id: string;
    movie_id: string;
    image_type: string;
    file_path: string;
  }[];
  files: {
    id: string;
    movie_id: string;
    file_path: string;
    resolution: string | null;
    video_codec: string | null;
    audio_codec: string | null;
    duration_seconds: number | null;
    file_size: number | null;
    checksum: string | null;
    created_at: string;
  }[];
}

interface MovieDetailProps {
  params: Promise<{
    id: string;
  }>;
}

async function getMovieDetail(id: string): Promise<MovieDetailBackend | null> {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${backendUrl}/movies/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch movie: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    return null;
  }
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  if (!movie) {
    notFound();
  }

  const mediaStorageUrl =
    process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3001/storage";

  const formatMediaUrl = (filePath: string) => {
    if (!filePath) return "";

    // Jika file_path dari database sudah diawali dengan 'storage/' atau '/storage/'
    if (filePath.startsWith("storage/") || filePath.startsWith("/storage/")) {
      const cleanPath = filePath.replace(/^\/?storage\//, "");
      return `${mediaStorageUrl}/${cleanPath}`;
    }

    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    return `${mediaStorageUrl}/${cleanPath}`;
  };

  const coverImage =
    movie.images?.find((img) => img.image_type === "cover") ||
    movie.images?.[0];
  const posterImage =
    movie.images?.find((img) => img.image_type === "poster") || coverImage;

  const coverUrl = coverImage
    ? formatMediaUrl(coverImage.file_path)
    : "/placeholder.jpg";
  const posterUrl = posterImage
    ? formatMediaUrl(posterImage.file_path)
    : coverUrl;

  const videoFile = movie.files?.[0];
  const videoUrl = videoFile ? formatMediaUrl(videoFile.file_path) : null;

  const durationText = movie.runtimeMinutes
    ? `${movie.runtimeMinutes} mnt`
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Navbar
        leftMode="back"
        rightActions={
          <Button variant="destructive" size="sm" className="rounded-xl">
            Hapus Film
          </Button>
        }
      />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <section className="space-y-3">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                controlsList="nodownload"
                poster={coverUrl}
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <svg
                  className="w-12 h-12 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0118.75 8.25z"
                  />
                </svg>
                <p>Streaming video tidak tersedia untuk file ini.</p>
              </div>
            )}
          </div>
        </section>

        <div className="relative w-full h-87.5 md:h-112.5 bg-slate-900 overflow-hidden rounded-2xl border border-slate-800">
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={movie.title}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover opacity-30 blur-sm scale-105"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
              {/* Poster Image */}
              <div className="relative w-36 h-52 md:w-48 md:h-72 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/50 shrink-0 bg-slate-800">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 144px, 192px"
                  className="object-cover"
                />
              </div>

              {/* Title & Badges */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-600/80 text-indigo-100 font-mono text-xs rounded-md border border-indigo-500/30 font-semibold uppercase">
                    {movie.code}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                  {movie.title}
                </h1>

                {movie.originalTitle && (
                  <p className="text-sm text-slate-400 italic">
                    {movie.originalTitle}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                  {durationText && <span>{durationText}</span>}
                  {movie.releaseDate && (
                    <span>
                      Released:{" "}
                      {new Date(movie.releaseDate).toLocaleDateString("id-ID")}
                    </span>
                  )}
                  {movie.language && (
                    <span className="uppercase px-2 py-0.5 bg-slate-800 rounded text-xs">
                      {movie.language}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. METADATA SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-lg font-semibold text-white">Deskripsi</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {movie.overview || "Belum ada deskripsi untuk film ini."}
              </p>
            </div>

            {/* Genres / Tags */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Genre / Tag
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres && movie.genres.length > 0 ? (
                  movie.genres.map((item) => (
                    <span
                      key={item.id}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                    >
                      {item.name}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs">-</span>
                )}
              </div>
            </div>

            {/* Cast List */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pemeran (Cast)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {movie.casts && movie.casts.length > 0 ? (
                  movie.casts.map((actor) => (
                    <div
                      key={actor.id}
                      className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/80 text-slate-200 text-sm font-medium"
                    >
                      {actor.name}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs col-span-2">-</span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Detail Attributes */}
          <aside className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-5">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
                Informasi Detail
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Kode
                  </span>
                  <span className="font-mono text-indigo-400 font-semibold uppercase">
                    {movie.code}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Sutradara (Director)
                  </span>
                  <span className="text-slate-200 font-medium">
                    {movie.directors?.map((d) => d.name).join(", ") || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Studio
                  </span>
                  <span className="text-slate-200 font-medium">
                    {movie.studios?.map((s) => s.name).join(", ") || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Label
                  </span>
                  <span className="text-slate-200 font-medium">
                    {movie.labels?.map((l) => l.name).join(", ") || "-"}
                  </span>
                </div>

                {movie.series && movie.series.length > 0 && (
                  <div>
                    <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                      Seri (Series)
                    </span>
                    <span className="text-amber-400 font-medium">
                      {movie.series.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
