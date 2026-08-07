import Image from "next/image";
import Link from "next/link";

// 1. Update tipe props agar params berbentuk Promise
interface MovieDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export interface MovieDetail {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  coverUrl: string;
  videoUrl: string;
  director: string;
  studio: string;
  label: string;
  series?: string;
  genres: string[];
  cast: string[];
  rating?: number;
  status: "WATCHED" | "WATCHLIST" | "DELETED";
  isFavorite: boolean;
  releaseDate?: string;
  duration?: string;
  description?: string;
}

const DUMMY_MOVIES: Record<string, MovieDetail> = {
  "1": {
    id: "1",
    code: "ABC-123",
    title: "Inception",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
    coverUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    director: "Christopher Nolan",
    studio: "Syncopy / Warner Bros.",
    label: "Blockbuster Collection",
    series: "Nolan Mind-Benders",
    genres: ["Sci-Fi", "Action", "Thriller"],
    cast: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Elliot Page",
      "Tom Hardy",
    ],
    rating: 9.0,
    status: "WATCHED",
    isFavorite: true,
    releaseDate: "2010-07-16",
    duration: "2h 28m",
    description:
      "Seorang pencuri yang mencuri rahasia korporat melalui penggunaan teknologi berbagi mimpi diberikan tugas sebaliknya untuk menanamkan ide ke dalam pikiran seorang CEO.",
  },
  "2": {
    id: "2",
    code: "XYZ-001",
    title: "Interstellar",
    posterUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60",
    coverUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    director: "Christopher Nolan",
    studio: "Paramount Pictures / Syncopy",
    label: "Collector's Edition",
    series: "Space Exploration Arc",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    cast: [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Michael Caine",
    ],
    rating: 8.7,
    status: "WATCHED",
    isFavorite: true,
    releaseDate: "2014-11-07",
    duration: "2h 49m",
    description:
      "Ketika Bumi menjadi tidak layak huni lagi di masa depan, seorang mantan pilot NASA memimpin tim penjelajah melintasi wormhole untuk menemukan planet baru bagi umat manusia.",
  },
  "3": {
    id: "3",
    code: "MOV-042",
    title: "Dune: Part Two",
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60",
    coverUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    director: "Denis Villeneuve",
    studio: "Legendary Pictures / Warner Bros.",
    label: "IMAX Special",
    series: "Dune Saga",
    genres: ["Sci-Fi", "Adventure", "Action"],
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"],
    rating: 8.5,
    status: "WATCHLIST",
    isFavorite: false,
    releaseDate: "2024-03-01",
    duration: "2h 46m",
    description:
      "Paul Atreides bersatu dengan Chani dan suku Fremen untuk membalas dendam terhadap para konspirator yang menghancurkan keluarganya.",
  },
  "4": {
    id: "4",
    code: "DEL-999",
    title: "Old Project File (Deleted)",
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop&q=60",
    coverUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    director: "Unknown",
    studio: "Archived Studio",
    label: "Legacy Archive",
    series: "-",
    genres: ["Documentary", "Archive"],
    cast: ["N/A"],
    status: "DELETED",
    isFavorite: false,
    releaseDate: "2020-01-01",
    duration: "1h 10m",
    description: "File rekaman lama yang sudah dihapus dari repositori aktif.",
  },
};

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  // 2. Unwrapping `params` dengan `await`
  const { id } = await params;

  // Mengambil data berdasarkan ID, jika tidak ada fallback ke ID 1
  const movie: MovieDetail = DUMMY_MOVIES[id] || DUMMY_MOVIES["1"];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* 2. VIDEO STREAMING SECTION */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Streaming Film
          </h2>

          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {movie.videoUrl ? (
              <video
                src={movie.videoUrl}
                controls
                controlsList="nodownload"
                poster={movie.coverUrl}
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

        {/* 1. HERO / COVER SECTION */}
        <div className="relative w-full h-87.5 md:h-112.5 bg-slate-900 overflow-hidden">
          <Image
            src={movie.coverUrl}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
              {/* Poster Image */}
              <div className="relative w-36 h-52 md:w-48 md:h-72 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/50 shrink-0">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 144px, 192px"
                  className="object-cover"
                />
              </div>

              {/* Title & Badges */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-indigo-600/80 text-indigo-100 font-mono text-xs rounded-md border border-indigo-500/30 font-semibold">
                    {movie.code}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded-md font-semibold border ${
                      movie.status === "WATCHED"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : movie.status === "WATCHLIST"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {movie.status}
                  </span>

                  {movie.isFavorite && (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs rounded-md border border-rose-500/30 font-medium">
                      ★ Favorite
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                  {movie.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  {movie.rating && (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      ★ {movie.rating} / 10
                    </span>
                  )}
                  <span>{movie.duration}</span>
                  {movie.releaseDate && (
                    <span>Released: {movie.releaseDate}</span>
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
                {movie.description || "Belum ada deskripsi untuk film ini."}
              </p>
            </div>

            {/* Genres / Tags */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Genre / Tag
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Cast List */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pemeran (Cast)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {movie.cast.map((actor) => (
                  <div
                    key={actor}
                    className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/80 text-slate-200 text-sm font-medium"
                  >
                    {actor}
                  </div>
                ))}
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
                  <span className="font-mono text-indigo-400 font-semibold">
                    {movie.code}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Sutradara (Director)
                  </span>
                  <span className="text-slate-200 font-medium">
                    {movie.director}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Studio
                  </span>
                  <span className="text-slate-200 font-medium">
                    {movie.studio}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                    Label
                  </span>
                  <span className="text-slate-200 font-medium">
                    {movie.label}
                  </span>
                </div>

                {movie.series && (
                  <div>
                    <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                      Seri (Series)
                    </span>
                    <span className="text-amber-400 font-medium">
                      {movie.series}
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
