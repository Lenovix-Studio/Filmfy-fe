"use client";

import React from "react";
import { ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OtherSettingsProps {
  onResetData?: () => void;
}

export const OtherSettings: React.FC<OtherSettingsProps> = ({
  onResetData = () => alert("Segera Hadir"),
}) => {
  return (
    <div className="space-y-6">
      <section className="bg-red-50/60 border border-red-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-4 border-b border-red-100">
          <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Zona Bahaya
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
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
