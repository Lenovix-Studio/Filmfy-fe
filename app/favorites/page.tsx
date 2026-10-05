import { BACKEND_URL } from "@/lib/constant";
import { FavoriteMovie } from "@/lib/types";
import FavoritesClient from "./FavoritesClient";

export const dynamic = "force-dynamic";

async function getFavorites(): Promise<FavoriteMovie[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/movies/favorites`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const result = await res.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Gagal mengambil daftar favorit:", error);
    return [];
  }
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return <FavoritesClient initialFavorites={favorites} />;
}
