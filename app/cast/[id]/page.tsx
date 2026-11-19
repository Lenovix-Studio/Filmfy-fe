import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { CastDetailBackend } from "@/lib/types";
import {
  formatDateWithAge,
  formatDebutWithDuration,
  formatThreeSizes,
} from "@/lib/utils";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Film,
  User,
  ImageIcon,
  Calendar,
  MapPin,
  Ruler,
  Briefcase,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface CastPageProps {
  params: Promise<{ id: string }>;
}

async function getCast(id: string): Promise<CastDetailBackend | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/casts/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getSocialMediaUrl(
  platform: string,
  handle: string,
  url?: string | null,
) {
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  const cleanHandle = handle.replace(/^@/, "").trim();
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return `https://instagram.com/${cleanHandle}`;
  if (p.includes("twitter") || p === "x") return `https://x.com/${cleanHandle}`;
  if (p.includes("tiktok")) return `https://tiktok.com/@${cleanHandle}`;
  if (p.includes("youtube")) return `https://youtube.com/@${cleanHandle}`;
  return url || "#";
}

export default async function CastPage({ params }: CastPageProps) {
  const { id } = await params;
  const cast = await getCast(id);
  if (!cast) notFound();

  const formatUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const clean = path.startsWith("/") ? path.slice(1) : path;
    if (!STORAGE_URL) return `/${clean}`;
    return `${STORAGE_URL}/${clean}`;
  };

  const profileImg = cast.profile_path ? formatUrl(cast.profile_path) : null;
  const galleryImages =
    cast.images?.filter((img) => img.image_type === "cast_gallery") || [];

  const threeSizes = formatThreeSizes(
    cast.bust,
    cast.cup,
    cast.waist,
    cast.hip,
  );

  const bodyDisplay = [
    cast.height ? `${cast.height}cm` : null,
    cast.body_notes || null,
  ]
    .filter(Boolean)
    .join(", ");

  const hasMetadata =
    cast.birth_date ||
    cast.birth_place ||
    bodyDisplay ||
    threeSizes ||
    cast.agency ||
    cast.debut_date;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header
        center={
          <h1 className="text-xl font-bold truncate max-w-md">
            {cast.display_name || cast.name}
          </h1>
        }
      />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Profile Header Section */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-indigo-500/30 shadow-2xl relative">
                {profileImg ? (
                  <Image
                    src={profileImg}
                    alt={cast.display_name || cast.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                    <User size={80} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Cast Profile
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-1">
                  {cast.display_name || cast.name}
                </h1>
                {cast.other_name && (
                  <p className="text-sm font-medium text-indigo-300/80">
                    Nama Lain: {cast.other_name}
                  </p>
                )}
              </div>

              {cast.bio ? (
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl whitespace-pre-line">
                  {cast.bio}
                </p>
              ) : (
                <p className="text-slate-500 italic text-sm">
                  Tidak ada biografi / deskripsi.
                </p>
              )}

              {/* Social Media Links */}
              {cast.social_media && cast.social_media.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {cast.social_media.map((s) => {
                    const href = getSocialMediaUrl(s.platform, s.handle, s.url);
                    return (
                      <a
                        key={s.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
                      >
                        <span className="text-indigo-400 font-semibold">
                          {s.platform}:
                        </span>
                        <span>{s.handle}</span>
                        <ExternalLink size={12} className="text-slate-400" />
                      </a>
                    );
                  })}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href={`/cast/edit/${cast.id}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                    <Edit size={16} />
                    Edit Profil & Data
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Cast Details / Facts / Metadata Grid */}
          {hasMetadata && (
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {cast.birth_date && (
                <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <Calendar
                    className="text-indigo-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Birth Date
                    </span>
                    <span className="text-slate-200 font-medium">
                      {formatDateWithAge(cast.birth_date)}
                    </span>
                  </div>
                </div>
              )}

              {cast.birth_place && (
                <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <MapPin
                    className="text-indigo-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Birth Location / Nationality
                    </span>
                    <span className="text-slate-200 font-medium">
                      {cast.birth_place}
                    </span>
                  </div>
                </div>
              )}

              {bodyDisplay && (
                <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <Ruler
                    className="text-indigo-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Body
                    </span>
                    <span className="text-slate-200 font-medium">
                      {bodyDisplay}
                    </span>
                  </div>
                </div>
              )}

              {threeSizes && (
                <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <Sparkles
                    className="text-indigo-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Three Sizes
                    </span>
                    <span className="text-slate-200 font-medium">
                      {threeSizes}
                    </span>
                  </div>
                </div>
              )}

              {cast.agency && (
                <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <Briefcase
                    className="text-indigo-400 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Agency
                    </span>
                    <span className="text-slate-200 font-medium">
                      {cast.agency}
                    </span>
                  </div>
                </div>
              )}

              {cast.debut_date && (
                <div className="flex items-start gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <Film className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Debut
                    </span>
                    <span className="text-slate-200 font-medium">
                      {formatDebutWithDuration(cast.debut_date)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Movies List Section */}
        {cast.movies && cast.movies.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Film className="text-indigo-400" size={24} />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Film yang Diperankan{" "}
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({cast.movies.length})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cast.movies.map((movie: any) => {
                const coverImg =
                  movie.images?.find(
                    (img: any) => img.image_type === "cover",
                  ) || movie.images?.[0];
                const coverUrl = coverImg
                  ? formatUrl(coverImg.file_path)
                  : null;

                return (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col"
                  >
                    <div className="aspect-3/4 w-full bg-slate-950 relative overflow-hidden">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={movie.title || movie.code}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                          <Film size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-600/90 rounded text-white backdrop-blur-sm">
                          Lihat Detail
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1 space-y-1">
                      <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                        {movie.code}
                      </span>
                      <h3 className="text-xs md:text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-white transition-colors">
                        {movie.title || "Tanpa Judul"}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <ImageIcon className="text-indigo-400" size={24} />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Galeri Foto{" "}
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({galleryImages.length})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-4/3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md hover:border-indigo-500/50 transition-all duration-300"
                >
                  <Image
                    src={formatUrl(img.file_path)}
                    alt="Cast Gallery Photo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
