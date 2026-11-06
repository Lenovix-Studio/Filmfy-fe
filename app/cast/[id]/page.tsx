import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { CastDetailBackend } from "@/lib/types";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Edit, Film, User, ImageIcon } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header
        center={
          <h1 className="text-xl font-bold truncate max-w-md">
            {cast.display_name || cast.name}
          </h1>
        }
      />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
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
                <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
                  {cast.bio}
                </p>
              ) : (
                <p className="text-slate-500 italic text-sm">
                  Tidak ada biografi.
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link href={`/cast/edit/${cast.id}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                    <Edit size={16} />
                    Edit Profil & Foto
                  </Button>
                </Link>
              </div>
            </div>
          </div>
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
