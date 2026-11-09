"use client";

import React from "react";
import { Trash2, Heart, FolderX } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OtherSettingsProps {
  onResetData?: () => void;
  onClearFavorites?: () => void;
  onClearTemp?: () => void;
  isClearingTemp?: boolean;
}

export const OtherSettings: React.FC<OtherSettingsProps> = ({
  onResetData = () => alert("Segera Hadir"),
  onClearFavorites = () => alert("Segera Hadir"),
  onClearTemp = () => alert("Segera Hadir"),
  isClearingTemp = false,
}) => {
  return (
    <div className="space-y-6">
      <section className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              Clear Cache & Temporary Folder
            </p>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Membersihkan file sampah sementara pada folder dev/prod temp dan
              temp media crawler (temp_images, temp_trailers).
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onClearTemp}
            disabled={isClearingTemp}
            className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          >
            <FolderX className="w-4 h-4 mr-2" />
            {isClearingTemp ? "Membersihkan..." : "Clear Temp"}
          </Button>
        </div>
      </section>

      <section className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              Hapus Semua Favorit
            </p>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Menghapus semua film dari daftar favorit. Film tidak akan dihapus
              dari database.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onClearFavorites}
            className="shrink-0 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Heart className="w-4 h-4 mr-2" />
            Hapus Semua Favorit
          </Button>
        </div>
      </section>

      <section className="bg-red-50/60 border border-red-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              Reset Semua Data Film
            </p>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Tindakan ini akan menghapus seluruh daftar film dan statistik yang
              ada secara permanen.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={onResetData}
            className="shrink-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset Semua Data
          </Button>
        </div>
      </section>
    </div>
  );
};

export default OtherSettings;
