import HomeClient from "./HomeClient";
import { BACKEND_URL } from "@/lib/constant";
import { ApiMovie, Movie } from "@/lib/types";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialMovies: Movie[] = [];
  let filterTabs = [{ id: "ALL", label: "All" }];

  try {
    const res = await fetch(`${BACKEND_URL}/movies`, {
      cache: "no-store",
    });

    if (res.ok) {
      const result = await res.json();
      if (Array.isArray(result.data)) {
        initialMovies = result.data.map((item: ApiMovie) => {
          const cleanCoverPath = item.coverPath?.replace(/^\//, "");

          return {
            id: item.id,
            code: item.code,
            title: item.title,
            posterUrl: cleanCoverPath
              ? `${BACKEND_URL}/storage/${cleanCoverPath}`
              : "/placeholder-poster.webp",
            status: "DELETED",
            isFavorite: false,
          };
        });
      }
    }
  } catch (error) {
    toast.error("Gagal mengambil data film", error || "");
    console.error("Gagal mengambil data film:", error);
  }

  try {
    const res = await fetch(`${BACKEND_URL}/common-codes/STATUS/details`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      const arrayData = Array.isArray(result)
        ? result
        : result?.data
          ? result.data
          : [];
      const activeStatus = arrayData
        .filter((item: any) => item.is_active !== false && item.code !== "ALL")
        .sort((a: any, b: any) => a.order - b.order);

      filterTabs = [
        { id: "ALL", label: "All" },
        ...activeStatus.map((item: any) => ({
          id: item.code,
          label: item.label,
        })),
      ];
    }
  } catch (error) {
    toast.error("Gagal mengambil status filter", error || "");
    console.error("Gagal mengambil status filter", error);
  }

  return (
    <HomeClient initialMovies={initialMovies} initialFilterTabs={filterTabs} />
  );
}
