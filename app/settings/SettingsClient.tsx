"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/constant";
import { CodeDetailType, CodeType, SettingsTabType } from "@/lib/types";
import TypeCodeDialog from "./components/TypeCodeDialog";
import DetailCodeDialog from "./components/DetailCodeDialog";
import OtherSettings from "./components/OtherSettings";
import CommonCodeSettings from "./components/CommonCodeSettings";
import SettingsTabs from "./components/SettingsTabs";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import SystemLogs from "./components/SystemLogs";

const API_BASE = `${BACKEND_URL}/common-codes`;

interface SettingsClientProps {
  initialTypes: CodeType[];
}

export default function SettingsClient({ initialTypes }: SettingsClientProps) {
  const [types, setTypes] = useState<CodeType[]>(initialTypes);
  const [details, setDetails] = useState<CodeDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTabType>("system_logs");
  const [resetDialog, setResetDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(
    initialTypes[0]?.code || "",
  );

  const [deleteTypeDialog, setDeleteTypeDialog] = useState<{
    isOpen: boolean;
    id: string;
  }>({ isOpen: false, id: "" });

  const [deleteDetailDialog, setDeleteDetailDialog] = useState<{
    isOpen: boolean;
    id: string;
  }>({ isOpen: false, id: "" });

  const [typeDialog, setTypeDialog] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Partial<CodeType>;
  }>({ isOpen: false, mode: "add", data: {} });

  const [detailDialog, setDetailDialog] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    data: Partial<CodeDetailType>;
  }>({ isOpen: false, mode: "add", data: {} });

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_BASE);
      const arrayData = Array.isArray(data)
        ? data
        : data?.data && Array.isArray(data.data)
          ? data.data
          : [];
      setTypes(arrayData);
      if (arrayData.length > 0 && !selectedType) {
        setSelectedType(arrayData[0].code);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data Type");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetails = async (typeCode: string) => {
    if (!typeCode) return;
    try {
      const { data } = await axios.get(`${API_BASE}/${typeCode}/details`);
      const arrayData = Array.isArray(data)
        ? data
        : data?.data && Array.isArray(data.data)
          ? data.data
          : [];
      setDetails(arrayData);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data Detail");
      setDetails([]);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    fetchDetails(selectedType);
  }, [selectedType]);

  const saveType = async () => {
    try {
      const { code, name, description } = typeDialog.data;
      if (!code || !name) {
        toast.error("Code dan Name wajib diisi!");
        return;
      }

      if (typeDialog.mode === "add") {
        await axios.post(API_BASE, {
          code,
          name,
          description: description || "",
        });
        toast.success("Berhasil menambahkan Type");
      } else {
        await axios.patch(`${API_BASE}/${typeDialog.data.id}`, {
          name,
          description: description || "",
        });
        toast.success("Berhasil mengubah Type");
      }
      setTypeDialog({ isOpen: false, mode: "add", data: {} });
      fetchTypes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan Type");
    }
  };

  const confirmDeleteType = async () => {
    const { id } = deleteTypeDialog;
    if (!id) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      toast.success("Berhasil menghapus Type");
      if (selectedType === types.find((t) => t.id === id)?.code) {
        setSelectedType("");
        setDetails([]);
      }
      fetchTypes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus Type");
    } finally {
      setDeleteTypeDialog({ isOpen: false, id: "" });
    }
  };

  const saveDetail = async () => {
    try {
      const { code, label, order, is_active } = detailDialog.data;
      if (!code || !label) {
        toast.error("Code dan Label wajib diisi!");
        return;
      }

      if (detailDialog.mode === "add") {
        await axios.post(`${API_BASE}/${selectedType}/details`, {
          code,
          label,
          order: Number(order) || 0,
          is_active: is_active ?? true,
        });
        toast.success("Berhasil menambahkan Detail");
      } else {
        await axios.patch(`${API_BASE}/details/${detailDialog.data.id}`, {
          label,
          order: Number(order) || 0,
          is_active: is_active ?? true,
        });
        toast.success("Berhasil mengubah Detail");
      }
      setDetailDialog({ isOpen: false, mode: "add", data: {} });
      fetchDetails(selectedType);
      fetchTypes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan Detail");
    }
  };

  const confirmDeleteDetail = async () => {
    const { id } = deleteDetailDialog;
    if (!id) return;

    try {
      await axios.delete(`${API_BASE}/details/${id}`);
      toast.success("Berhasil menghapus Detail");
      fetchDetails(selectedType);
      fetchTypes();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus Detail");
    } finally {
      setDeleteDetailDialog({ isOpen: false, id: "" });
    }
  };

  const confirmResetData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${BACKEND_URL}/settings/reset`);
      toast.success(res.data?.message || "Data berhasil di-reset");
    } catch (error: any) {
      console.error("Reset error:", error);
      toast.error(error.response?.data?.message || "Gagal mereset data");
    } finally {
      setIsLoading(false);
      setResetDialog(false);
    }
  };

  return (
    <>
      <Header
        center={
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Pengaturan
            </h1>
          </div>
        }
        right={false}
      />

      <main className="w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "common_code" && (
          <CommonCodeSettings
            types={types}
            details={details}
            selectedType={selectedType}
            isLoading={isLoading}
            onSelectType={setSelectedType}
            onAddType={() =>
              setTypeDialog({ isOpen: true, mode: "add", data: {} })
            }
            onEditType={(item) =>
              setTypeDialog({ isOpen: true, mode: "edit", data: item })
            }
            onDeleteType={(id) => setDeleteTypeDialog({ isOpen: true, id })}
            onAddDetail={() =>
              setDetailDialog({
                isOpen: true,
                mode: "add",
                data: { is_active: true },
              })
            }
            onEditDetail={(detail) =>
              setDetailDialog({ isOpen: true, mode: "edit", data: detail })
            }
            onDeleteDetail={(id) => setDeleteDetailDialog({ isOpen: true, id })}
          />
        )}

        {activeTab === "system_logs" && <SystemLogs />}

        {activeTab === "other" && (
          <OtherSettings onResetData={() => setResetDialog(true)} />
        )}
      </main>

      <TypeCodeDialog
        isOpen={typeDialog.isOpen}
        onOpenChange={(open) =>
          setTypeDialog((prev) => ({ ...prev, isOpen: open }))
        }
        mode={typeDialog.mode}
        data={typeDialog.data}
        onChange={(updatedData) =>
          setTypeDialog((prev) => ({ ...prev, data: updatedData }))
        }
        onSave={saveType}
      />

      <DetailCodeDialog
        isOpen={detailDialog.isOpen}
        onOpenChange={(open) =>
          setDetailDialog((prev) => ({ ...prev, isOpen: open }))
        }
        mode={detailDialog.mode}
        data={detailDialog.data}
        onChange={(updatedData) =>
          setDetailDialog((prev) => ({ ...prev, data: updatedData }))
        }
        onSave={saveDetail}
      />

      {/* DELETE TYPE CONFIRMATION DIALOG */}
      <DeleteConfirmDialog
        isOpen={deleteTypeDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteTypeDialog((prev) => ({ ...prev, isOpen: open }))
        }
        title="Hapus Type?"
        description="Tindakan ini tidak dapat dibatalkan. Menghapus Type ini juga akan menghapus semua detail di dalamnya."
        onConfirm={confirmDeleteType}
      />

      {/* DELETE DETAIL CONFIRMATION DIALOG */}
      <DeleteConfirmDialog
        isOpen={deleteDetailDialog.isOpen}
        onOpenChange={(open) =>
          setDeleteDetailDialog((prev) => ({ ...prev, isOpen: open }))
        }
        title="Hapus Detail?"
        description="Tindakan ini tidak dapat dibatalkan. Data yang terhubung dengan detail ini mungkin akan terdampak."
        onConfirm={confirmDeleteDetail}
      />

      {/* RESET DATA CONFIRMATION DIALOG */}
      <DeleteConfirmDialog
        isOpen={resetDialog}
        onOpenChange={setResetDialog}
        title="Reset Semua Data?"
        description="Tindakan ini akan menghapus semua daftar film dan file penyimpanannya secara permanen. Apakah Anda yakin?"
        onConfirm={confirmResetData}
      />
    </>
  );
}
