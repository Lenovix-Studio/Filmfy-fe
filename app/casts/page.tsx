import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import Header from "@/components/Header";
import { Users } from "lucide-react";
import CastsClient from "./CastsClient";

export const dynamic = "force-dynamic";

export interface CastItem {
  id: string;
  name: string;
  display_name?: string | null;
  other_name?: string | null;
  bio?: string | null;
  profile_path?: string | null;
  movies_count: number;
}

async function getCasts(): Promise<CastItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/casts`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Gagal mengambil data casts:", error);
    return [];
  }
}

export default async function CastsPage() {
  const casts = await getCasts();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header
        center={
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Daftar Cast
            </h1>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Pemeran & Aktris
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Jelajahi profil lengkap pemeran dan daftar film yang
              dibintanginya.
            </p>
          </div>
          <div className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold rounded-xl text-sm self-start sm:self-auto">
            Total: {casts.length} Casts
          </div>
        </div>

        <CastsClient initialCasts={casts} storageUrl={STORAGE_URL || ""} />
      </main>
    </div>
  );
}
