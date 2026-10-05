import { Metadata } from "next";
import SettingsClient from "./SettingsClient";
import { BACKEND_URL } from "@/lib/constant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengaturan",
  description: "Konfigurasi sistem dan manajemen data",
};

export default async function SettingsPage() {
  let initialTypes = [];

  try {
    const res = await fetch(`${BACKEND_URL}/common-codes`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      initialTypes = Array.isArray(data)
        ? data
        : data?.data && Array.isArray(data.data)
          ? data.data
          : [];
    }
  } catch (error) {
    console.error("Gagal mengambil initial data Types:", error);
  }

  return <SettingsClient initialTypes={initialTypes} />;
}
