import { Metadata } from "next";
import { BACKEND_URL } from "@/lib/constant";
import UploadClient from "./UploadClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upload Film",
  description: "Upload film baru dengan cover, video, dan metadata lengkap",
};

async function getStatusOptions(): Promise<{ id: string; label: string }[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/common-codes/STATUS/details`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const result = await res.json();
    const arrayData = Array.isArray(result) ? result : result?.data || [];

    return arrayData
      .filter(
        (item: any) =>
          item.is_active !== false &&
          (item.code === "WATCHED" || item.code === "DELETED"),
      )
      .sort((a: any, b: any) => a.order - b.order)
      .map((item: any) => ({ id: item.code, label: item.label }));
  } catch (error) {
    console.error("Gagal mengambil status:", error);
    return [];
  }
}

export default async function UploadPage() {
  const statusOptions = await getStatusOptions();

  return <UploadClient statusOptions={statusOptions} />;
}
