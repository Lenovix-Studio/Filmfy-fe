"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crop, Check } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  onClose: () => void;
  onCropComplete: (file: File, previewUrl: string) => void;
}

type AspectRatio = "free" | "2/3" | "16/9";

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = "cover.jpg",
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [aspect, setAspect] = useState<AspectRatio>("2/3");
  const [zoom, setZoom] = useState<number>(1);
  const [cropBox, setCropBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgDisplaySize, setImgDisplaySize] = useState({ width: 0, height: 0 });

  // Dragging state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialCrop = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragMode = useRef<"move" | "resize-se">("move");

  const initCropBox = useCallback(
    (aspectRatio: AspectRatio, containerW: number, containerH: number) => {
      let targetRatio = 2 / 3;
      if (aspectRatio === "16/9") targetRatio = 16 / 9;
      else if (aspectRatio === "free") targetRatio = containerW / containerH;

      let w = containerW * 0.8;
      let h = w / targetRatio;

      if (h > containerH * 0.8) {
        h = containerH * 0.8;
        w = h * targetRatio;
      }

      const x = Math.max(0, (containerW - w) / 2);
      const y = Math.max(0, (containerH - h) / 2);

      setCropBox({ x, y, width: w, height: h });
    },
    [],
  );

  const handleImageLoad = () => {
    if (!imgRef.current || !containerRef.current) return;
    const { offsetWidth, offsetHeight } = imgRef.current;
    setImgDisplaySize({ width: offsetWidth, height: offsetHeight });
    setImgLoaded(true);
    initCropBox(aspect, offsetWidth, offsetHeight);
  };

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setImgLoaded(false);
    }
  }, [isOpen, imageSrc]);

  useEffect(() => {
    if (imgLoaded && imgDisplaySize.width > 0) {
      initCropBox(aspect, imgDisplaySize.width, imgDisplaySize.height);
    }
  }, [aspect, imgLoaded, imgDisplaySize, initCropBox]);

  const handlePointerDown = (
    clientX: number,
    clientY: number,
    mode: "move" | "resize-se",
  ) => {
    isDragging.current = true;
    dragMode.current = mode;
    dragStart.current = { x: clientX, y: clientY };
    initialCrop.current = { ...cropBox };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging.current || !imgDisplaySize.width) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    if (dragMode.current === "move") {
      let newX = initialCrop.current.x + dx;
      let newY = initialCrop.current.y + dy;
      newX = Math.max(
        0,
        Math.min(newX, imgDisplaySize.width - initialCrop.current.width),
      );
      newY = Math.max(
        0,
        Math.min(newY, imgDisplaySize.height - initialCrop.current.height),
      );
      setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (dragMode.current === "resize-se") {
      let newW = Math.max(40, initialCrop.current.width + dx);
      let targetRatio =
        aspect === "2/3" ? 2 / 3 : aspect === "16/9" ? 16 / 9 : 0;
      let newH = targetRatio
        ? newW / targetRatio
        : Math.max(40, initialCrop.current.height + dy);

      if (initialCrop.current.x + newW > imgDisplaySize.width) {
        newW = imgDisplaySize.width - initialCrop.current.x;
        if (targetRatio) newH = newW / targetRatio;
      }
      if (initialCrop.current.y + newH > imgDisplaySize.height) {
        newH = imgDisplaySize.height - initialCrop.current.y;
        if (targetRatio) newW = newH * targetRatio;
      }

      setCropBox((prev) => ({ ...prev, width: newW, height: newH }));
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleApplyCrop = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / imgDisplaySize.width;
    const scaleY = img.naturalHeight / imgDisplaySize.height;

    const canvas = document.createElement("canvas");
    const cropWidth = cropBox.width * scaleX;
    const cropHeight = cropBox.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      img,
      cropBox.x * scaleX,
      cropBox.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], fileName || "cover_cropped.jpg", {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(blob);
        onCropComplete(croppedFile, previewUrl);
        onClose();
      },
      "image/jpeg",
      0.92,
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Crop className="w-5 h-5 text-indigo-400" />
            Crop Cover Movie
          </DialogTitle>
        </DialogHeader>

        {/* Aspect Ratio Buttons */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Rasio Aspek:
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={aspect === "2/3" ? "default" : "outline"}
              className={
                aspect === "2/3"
                  ? "bg-indigo-600 text-white"
                  : "border-slate-700 text-slate-300"
              }
              onClick={() => setAspect("2/3")}
            >
              2:3 (Portrait)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={aspect === "16/9" ? "default" : "outline"}
              className={
                aspect === "16/9"
                  ? "bg-indigo-600 text-white"
                  : "border-slate-700 text-slate-300"
              }
              onClick={() => setAspect("16/9")}
            >
              16:9 (Landscape)
            </Button>
            <Button
              type="button"
              size="sm"
              variant={aspect === "free" ? "default" : "outline"}
              className={
                aspect === "free"
                  ? "bg-indigo-600 text-white"
                  : "border-slate-700 text-slate-300"
              }
              onClick={() => setAspect("free")}
            >
              Free
            </Button>
          </div>
        </div>

        {/* Cropper Container */}
        <div
          ref={containerRef}
          className="relative w-full h-80 sm:h-96 bg-black/80 rounded-xl overflow-hidden flex items-center justify-center select-none cursor-crosshair border border-slate-800"
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onTouchMove={(e) => {
            if (e.touches[0])
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handlePointerUp}
        >
          {/* Base Image */}
          <div
            className="relative transition-transform duration-75"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Source"
              onLoad={handleImageLoad}
              className="max-h-72 sm:max-h-88 object-contain pointer-events-none block"
            />

            {/* Dark overlay & crop box */}
            {imgLoaded && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  width: imgDisplaySize.width,
                  height: imgDisplaySize.height,
                }}
              >
                {/* Crop Box Area */}
                <div
                  className="absolute border-2 border-indigo-400 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] pointer-events-auto cursor-move"
                  style={{
                    left: `${cropBox.x}px`,
                    top: `${cropBox.y}px`,
                    width: `${cropBox.width}px`,
                    height: `${cropBox.height}px`,
                  }}
                  onMouseDown={(e: MouseEvent) => {
                    e.stopPropagation();
                    handlePointerDown(e.clientX, e.clientY, "move");
                  }}
                  onTouchStart={(e: TouchEvent) => {
                    e.stopPropagation();
                    if (e.touches[0])
                      handlePointerDown(
                        e.touches[0].clientX,
                        e.touches[0].clientY,
                        "move",
                      );
                  }}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-white/20" />
                    <div className="border-r border-white/20" />
                    <div />
                  </div>

                  {/* Corner handle for resize */}
                  <div
                    className="absolute -right-2 -bottom-2 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto shadow-md"
                    onMouseDown={(e: MouseEvent) => {
                      e.stopPropagation();
                      handlePointerDown(e.clientX, e.clientY, "resize-se");
                    }}
                    onTouchStart={(e: TouchEvent) => {
                      e.stopPropagation();
                      if (e.touches[0])
                        handlePointerDown(
                          e.touches[0].clientX,
                          e.touches[0].clientY,
                          "resize-se",
                        );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400">
            Geser kotak untuk memilih area atau drag bulatan sudut untuk resize.
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 text-slate-300"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleApplyCrop}
              className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Terapkan Crop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
