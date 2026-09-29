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
import { CodeType } from "@/lib/types";

export interface TypeCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  data: Partial<CodeType>;
  onChange: (data: Partial<CodeType>) => void;
  onSave: () => void;
}

export const TypeCodeDialog: React.FC<TypeCodeDialogProps> = ({
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
            {mode === "add" ? "Tambah Type Baru" : "Edit Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type-code">Code</Label>
            <Input
              id="type-code"
              value={data.code || ""}
              onChange={(e) =>
                onChange({ ...data, code: e.target.value.toUpperCase() })
              }
              disabled={mode === "edit"}
              placeholder="misal: MEDIA_TYPE"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-name">Name</Label>
            <Input
              id="type-name"
              value={data.name || ""}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="misal: Media Type"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-desc">Deskripsi</Label>
            <Input
              id="type-desc"
              value={data.description || ""}
              onChange={(e) =>
                onChange({ ...data, description: e.target.value })
              }
              placeholder="misal: Format media film"
            />
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

export default TypeCodeDialog;
