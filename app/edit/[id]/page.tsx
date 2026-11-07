import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BACKEND_URL } from "@/lib/constant";
import EditMovieClient from "./EditMovieClient";

export const dynamic = "force-dynamic";

async function getMovieDetail(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/movies/${id}`, {
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

async function getStatusOptions(): Promise<{ id: string; label: string }[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/common-codes/STATUS/details`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const result = await res.json();
    const arrayData = Array.isArray(result) ? result : result?.data || [];

    return arrayData
      .filter((item: any) => item.is_active !== false && item.code !== "ALL")
      .sort((a: any, b: any) => a.order - b.order)
      .map((item: any) => ({ id: item.code, label: item.label }));
  } catch (error) {
    console.error("Gagal mengambil status:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  if (!movie) {
    return {
      title: "Film Tidak Ditemukan",
    };
  }

  return {
    title: `Edit ${movie.code} - ${movie.title}`,
    description: `Edit detail film ${movie.title}`,
  };
}

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [movie, statusOptions] = await Promise.all([
    getMovieDetail(id),
    getStatusOptions(),
  ]);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <EditMovieClient movie={movie} statusOptions={statusOptions} />
    </div>
  );
}
