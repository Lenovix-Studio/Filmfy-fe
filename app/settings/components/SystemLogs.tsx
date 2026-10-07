"use client";

import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BACKEND_URL } from "@/lib/constant";
import { LogEntry, LogLevel } from "@/lib/types";

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState<LogLevel | "ALL">("ALL");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/settings/logs`);
        if (response.ok) {
          const result = await response.json();
          setLogs(result.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil log:", error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/settings/logs`, {
        method: "DELETE",
      });
      if (response.ok) {
        setLogs([]);
        toast.success("Log berhasil dihapus");
        setOpen(false);
      } else {
        toast.error("Gagal menghapus log");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menghapus log");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = activeLevel === "ALL" || log.level === activeLevel;
    return matchesSearch && matchesLevel;
  });

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case "INFO":
        return "text-emerald-400";
      case "WARN":
        return "text-amber-400";
      case "ERROR":
        return "text-rose-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari log atau sumber..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-slate-200"
            />
          </div>
          <div className="flex items-center gap-1">
            {(["ALL", "WARN", "ERROR"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  activeLevel === level
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive", size: "sm" })}
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Clear Logs
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus System Logs</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus semua system logs? Tindakan
                ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleClearLogs();
                }}
                disabled={isLoading}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                {isLoading ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="border-slate-800 bg-slate-950 shadow-xl overflow-hidden p-0">
        <CardContent className="p-0">
          <div className="h-125 overflow-y-auto font-mono text-sm p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-2 hover:bg-slate-900/50 p-1.5 rounded transition-colors group"
                >
                  <div className="shrink-0 text-slate-500 text-xs mt-0.5 w-36">
                    {log.timestamp}
                  </div>
            <div className="shrink-0 w-48">
              <pre className="text-xs whitespace-pre-wrap text-slate-400">{JSON.stringify(log.request, null, 2)}</pre>
            </div>
            <div className="shrink-0 w-48">
              <pre className="text-xs whitespace-pre-wrap text-slate-400">{JSON.stringify(log.response, null, 2)}</pre>
            </div>
                  <div
                    className="shrink-0 text-slate-400 text-xs mt-0.5 w-40 truncate"
                    title={log.source}
                  >
                    [{log.source}]
                  </div>
                  <div className="grow text-slate-300 wrap-break-word">
                    {log.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Tidak ada log yang ditemukan
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
