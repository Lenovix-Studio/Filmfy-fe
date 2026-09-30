"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constant";
import { MovieDetailBackend } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function MovieDetailClient({
  movie,
}: {
  movie: MovieDetailBackend & { isFavorite: boolean };
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(movie.isFavorite);

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus film ini?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/movies/${movie.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Film berhasil dihapus");
        router.push("/");
      } else {
        toast.error("Gagal menghapus film");
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
      setIsDeleting(false);
    }
  };

  const handleFavorite = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/movies/${movie.id}/favorite`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
        toast.success(data.message);
      } else {
        toast.error("Gagal update favorit");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="lg"
        onClick={handleFavorite}
        className={`rounded-xl shadow-md ${isFavorite ? "bg-pink-600 hover:bg-pink-700 shadow-pink-600/20 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        <span className="hidden sm:inline">
          {isFavorite ? "Favorited" : "Favorite"}
        </span>
      </Button>
      <Button
        size="lg"
        onClick={() => router.push(`/edit/${movie.id}`)}
        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
      >
        <Edit className="w-4 h-4" />
        <span className="hidden sm:inline">Edit</span>
      </Button>
      <Button
        size="lg"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">
          {isDeleting ? "Deleting..." : "Delete"}
        </span>
      </Button>
    </div>
  );
}
