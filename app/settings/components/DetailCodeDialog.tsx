"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeDetailType } from "@/lib/types";

export interface DetailCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  data: Partial<CodeDetailType>;
  onChange: (data: Partial<CodeDetailType>) => void;
  onSave: () => void;
}

export const DetailCodeDialog: React.FC<DetailCodeDialogProps> = ({
  isOpen,
  onOpenChange,
  mode,
  data,
  onChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Detail Baru" : "Edit Detail"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="detail-code">Code</Label>
            <Input
              id="detail-code"
              value={data.code || ""}
              onChange={(e) =>
                onChange({ ...data, code: e.target.value.toUpperCase() })
              }
              disabled={mode === "edit"}
              placeholder="misal: MOVIE"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail-label">Label</Label>
            <Input
              id="detail-label"
              value={data.label || ""}
              onChange={(e) => onChange({ ...data, label: e.target.value })}
              placeholder="misal: Movie"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail-order">Urutan (Order)</Label>
            <Input
              id="detail-order"
              type="number"
              value={data.order ?? 0}
              onChange={(e) =>
                onChange({
                  ...data,
                  order: isNaN(parseInt(e.target.value, 10))
                    ? 0
                    : parseInt(e.target.value, 10),
                })
              }
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="detail-active"
              checked={data.is_active ?? true}
              onChange={(e) =>
                onChange({ ...data, is_active: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
            />
            <Label htmlFor="detail-active" className="cursor-pointer">
              Status Aktif
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="button" onClick={onSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailCodeDialog;
