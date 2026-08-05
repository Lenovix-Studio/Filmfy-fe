"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Film,
  ArrowLeft,
  Settings,
  Moon,
  Sun,
  Database,
  Download,
  Upload,
  Trash2,
  Check,
  ShieldAlert,
  Sliders,
} from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [autoSave, setAutoSave] = useState(true);
  const [defaultFilter, setDefaultFilter] = useState("ALL");
  const [isExported, setIsExported] = useState(false);

  // Handler Export Data
  const handleExportData = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-rose-600 selection:text-white">
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 p-1.5 rounded-lg text-white shadow-lg shadow-rose-600/20">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-white">Filmfy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Title Section */}
        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-800 border border-neutral-700/60 rounded-xl text-neutral-300">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Pengaturan
            </h1>
          </div>
          <p className="text-neutral-400 text-sm mt-1.5">
            Atur tampilan, preferensi katalog, dan manajemen data koleksi film
            kamu.
          </p>
        </div>

        <div className="space-y-6">
          {/* SECTION 1: TAMPILAN & TEMA */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Moon className="w-4 h-4 text-rose-500" />
              <span>Tampilan & Tema</span>
            </h2>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-medium text-white">Mode Tema</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Pilih skema warna utama untuk antarmuka Filmfy.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-950 p-1 border border-neutral-800 rounded-xl">
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === "dark"
                      ? "bg-rose-600 text-white shadow-md"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === "light"
                      ? "bg-rose-600 text-white shadow-md"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: PREFERENSI KATALOG */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-500" />
              <span>Preferensi Katalog</span>
            </h2>

            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Filter Bawaan (Default Filter)
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Filter yang otomatis aktif saat membuka beranda.
                </p>
              </div>

              <select
                value={defaultFilter}
                onChange={(e) => setDefaultFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-medium text-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              >
                <option value="ALL">All (Semua)</option>
                <option value="WATCHED">Watched</option>
                <option value="WATCHLIST">Watchlist</option>
                <option value="FAVORITE">Favorite</option>
                <option value="DELETED">Deleted</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Simpan Otomatis Ke Penyimpanan Lokal
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Otomatis menyimpan perubahan katalog ke LocalStorage peramban.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSave ? "bg-rose-600" : "bg-neutral-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoSave ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* SECTION 3: MANAJEMEN DATA & CADANGAN */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-500" />
              <span>Manajemen Data (Backup & Restore)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Export */}
              <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Ekspor Data (JSON)
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Unduh file cadangan seluruh daftar film kamu dalam format
                    JSON.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-medium text-white transition-colors"
                >
                  {isExported ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Berhasil Diunduh!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-rose-400" />
                      <span>Ekspor JSON</span>
                    </>
                  )}
                </button>
              </div>

              {/* Import */}
              <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Impor Data (JSON)
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Pulihkan atau tambah daftar film dari file JSON yang
                    diunggah.
                  </p>
                </div>
                <label className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-xs font-medium text-white transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-rose-400" />
                  <span>Unggah File Backup</span>
                  <input type="file" accept=".json" className="hidden" />
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 4: ZONA BAHAYA / DANGER ZONE */}
          <section className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Zona Bahaya</span>
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <p className="text-sm font-semibold text-rose-200">
                  Reset Semua Data Film
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tindakan ini akan menghapus seluruh daftar film dan statistik
                  yang ada secara permanen.
                </p>
              </div>

              <button
                onClick={() =>
                  alert("Apakah Anda yakin ingin menghapus seluruh data?")
                }
                className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Semua Data</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
