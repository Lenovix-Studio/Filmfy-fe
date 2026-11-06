"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface GalleryLightboxProps {
  images: { id: string; url: string }[];
}

export default function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const isOpen = selectedIndex !== null;

  const handleClose = () => {
    setSelectedIndex(null);
    setScale(1);
  };

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
    setScale(1);
  }, [selectedIndex, images.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
    setScale(1);
  }, [selectedIndex, images.length]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.3, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => {
              setSelectedIndex(idx);
              setScale(1);
            }}
            className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group cursor-pointer hover:border-indigo-500/50 transition-all duration-300"
          >
            <Image
              src={img.url}
              alt="Galeri"
              fill
              unoptimized
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-600/90 text-white rounded-lg shadow-md backdrop-blur-xs">
                Perbesar
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between items-center p-4">
          {/* Top Bar Controls */}
          <div className="w-full flex items-center justify-between text-white z-10 px-2 py-1">
            <span className="text-sm font-medium bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 text-slate-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 text-slate-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-2 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 text-slate-200 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 bg-rose-600/90 hover:bg-rose-600 rounded-lg text-white transition-colors ml-2"
                title="Tutup (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Image View */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 z-10 p-3 bg-slate-900/80 hover:bg-indigo-600 text-white rounded-full border border-slate-800 shadow-xl transition-all"
              title="Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft size={24} />
            </button>

            <div
              className="relative w-full h-full max-h-[82vh] flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
            >
              <Image
                src={images[selectedIndex].url}
                alt={`Galeri ${selectedIndex + 1}`}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-10 p-3 bg-slate-900/80 hover:bg-indigo-600 text-white rounded-full border border-slate-800 shadow-xl transition-all"
              title="Selanjutnya (Panah Kanan)"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-4xl scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setScale(1);
                }}
                className={`relative w-16 h-10 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  idx === selectedIndex
                    ? "border-indigo-500 scale-105"
                    : "border-slate-800 opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`thumb-${idx}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
