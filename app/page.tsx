import HomeClient from "./HomeClient";
import { BACKEND_URL } from "@/lib/constant";
import { ApiMovie, Movie } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialMovies: Movie[] = [];
  let filterTabs = [{ id: "ALL", label: "All" }];
  let databaseError: string | null = null;

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
            status: item.status || "DELETED",
            isFavorite: false,
          };
        });
      }
    } else {
      const errBody = await res.json().catch(() => null);
      if (res.status === 503 || errBody?.error === "DatabaseUnavailable") {
        databaseError =
          errBody?.message ||
          "Database sedang mati atau tidak dapat dijangkau. Silakan periksa koneksi database server.";
      }
    }
  } catch (error) {
    console.error("Gagal mengambil data film:", error);
  }

  // Also check database health endpoint if databaseError not already detected
  if (!databaseError) {
    try {
      const healthRes = await fetch(`${BACKEND_URL}/health/db`, {
        cache: "no-store",
      });
      if (!healthRes.ok) {
        const healthData = await healthRes.json().catch(() => null);
        if (
          healthRes.status === 503 ||
          healthData?.error === "DatabaseUnavailable"
        ) {
          databaseError =
            healthData?.message ||
            "Database sedang mati atau tidak dapat dijangkau.";
        }
      }
    } catch {
      // Backend itself might be offline
    }
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
    console.error("Gagal mengambil status filter:", error);
  }

  return (
    <HomeClient
      initialMovies={initialMovies}
      initialFilterTabs={filterTabs}
      databaseError={databaseError}
    />
  );
}
