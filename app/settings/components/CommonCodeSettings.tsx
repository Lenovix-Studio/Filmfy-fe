"use client";

import React from "react";
import { Plus, Pencil, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeDetailType, CodeType } from "@/lib/types";

export interface CommonCodeSettingsProps {
  types: CodeType[];
  details: CodeDetailType[];
  selectedType: string | null;
  isLoading?: boolean;
  onSelectType: (code: string) => void;
  onAddType: () => void;
  onEditType: (type: CodeType) => void;
  onDeleteType: (id: string) => void;
  onAddDetail: () => void;
  onEditDetail: (detail: CodeDetailType) => void;
  onDeleteDetail: (id: string) => void;
}

export const CommonCodeSettings: React.FC<CommonCodeSettingsProps> = ({
  types,
  details,
  selectedType,
  isLoading = false,
  onSelectType,
  onAddType,
  onEditType,
  onDeleteType,
  onAddDetail,
  onEditDetail,
  onDeleteDetail,
}) => {
  return (
    <div className="space-y-8 w-full">
      {/* SECTION 1: CODE TYPE TABLE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Common Code Type
            </h2>
            <p className="text-xs text-slate-500">
              Daftar tipe master kode. Klik salah satu baris untuk melihat
              detailnya di bawah.
            </p>
          </div>
          <Button
            onClick={onAddType}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Tambah Type
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Deskripsi</th>
                <th className="py-3 px-4 font-semibold text-center">Items</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : types.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    Belum ada tipe kode.
                  </td>
                </tr>
              ) : (
                types.map((item) => {
                  const isSelected = selectedType === item.code;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectType(item.code)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-rose-50/70 border-l-4 border-l-rose-600"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-xs text-rose-600">
                        {item.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {item.count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditType(item);
                            }}
                            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteType(item.id);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: DETAIL CODE TABLE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Detail Type Values
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Filter className="w-3 h-3 text-slate-400" />
                Menampilkan data untuk:{" "}
                <span className="font-semibold text-rose-600 font-mono">
                  {selectedType || "-"}
                </span>
              </p>
            </div>
          </div>

          <Button
            onClick={onAddDetail}
            disabled={!selectedType}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Tambah Detail Item
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-y border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Urutan</th>
                <th className="py-3 px-4 font-semibold">Detail Code</th>
                <th className="py-3 px-4 font-semibold">Label</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {details.length > 0 ? (
                details.map((detail) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-xs font-semibold text-slate-400">
                      #{detail.order}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-xs text-slate-800">
                      {detail.code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {detail.label}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-block ${
                          detail.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {detail.is_active ? "Aktif" : "Non-aktif"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditDetail(detail)}
                          className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteDetail(detail.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-xs text-slate-400"
                  >
                    Belum ada item detail untuk tipe ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CommonCodeSettings;
