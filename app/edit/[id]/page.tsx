import { notFound } from "next/navigation";
import { BACKEND_URL } from "@/lib/constant";
import EditMovieClient from "./EditMovieClient";

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

export default async function EditMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <EditMovieClient movie={movie} />
    </div>
  );
}
