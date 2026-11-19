"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, ArrowLeft, Crop } from "lucide-react";
import Image from "next/image";
import { ExistingImage, GalleryItem, PendingImage } from "@/lib/types";
import ImageCropperModal from "@/components/ImageCropperModal";

const formatMediaUrl = (filePath: string) => {
  if (!filePath) return "";
  const cleanPath =
    filePath.startsWith("storage/") || filePath.startsWith("/storage/")
      ? filePath.replace(/^\/?storage\//, "")
      : filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;
  return `${STORAGE_URL}/${cleanPath}`;
};

interface EditMovieClientProps {
  movie: any;
  statusOptions?: { id: string; label: string }[];
  censorshipOptions?: { id: string; label: string }[];
}

export default function EditMovieClient({
  movie,
  statusOptions = [],
  censorshipOptions = [],
}: EditMovieClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: movie.title || "",
    code: movie.code || "",
    status: movie.status || "WATCHED",
    censorship_code: movie.censorship_code || movie.censorshipCode || "",
    overview: movie.overview || "",
    director: movie.directors?.map((d: any) => d.name).join(", ") || "",
    studio: movie.studios?.map((s: any) => s.name).join(", ") || "",
    label: movie.labels?.map((l: any) => l.name).join(", ") || "",
    series: movie.series?.map((s: any) => s.name).join(", ") || "",
    genre: movie.genres?.map((g: any) => g.name).join(", ") || "",
    cast: movie.casts?.map((c: any) => c.name).join(", ") || "",
  });

  const typedImages = (movie.images || []) as ExistingImage[];
  const existingCover = typedImages.find((img) => img.image_type === "cover");
  const existingGallery = typedImages.filter(
    (img) => img.image_type === "gallery" || img.image_type === "screenshot",
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    existingCover ? formatMediaUrl(existingCover.file_path) : null,
  );

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawCoverSrc, setRawCoverSrc] = useState<string | null>(null);
  const [rawCoverFileName, setRawCoverFileName] = useState("cover.jpg");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(
    movie.files?.[0] ? formatMediaUrl(movie.files[0].file_path) : null,
  );

  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(existingGallery);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawCoverFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawCoverSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCroppedCoverComplete = (file: File, previewUrl: string) => {
    setCoverFile(file);
    setCoverPreview(previewUrl);
    toast.success("Cover berhasil di-crop");
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleAddGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newItems: PendingImage[] = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      isNew: true as const,
    }));
    setGalleryItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveGallery = (index: number) => {
    const item = galleryItems[index];
    if ("isNew" in item) {
      URL.revokeObjectURL(item.preview);
    } else {
      setImagesToDelete((prev) => [...prev, item.id]);
    }
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title: formData.title,
      code: formData.code,
      status: formData.status,
      censorship_code: formData.censorship_code
        ? formData.censorship_code
        : null,
      overview: formData.overview,
      director: formData.director
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean),
      studio: formData.studio
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean),
      label: formData.label
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean),
      series: formData.series
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean),
      genre: formData.genre
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean),
      cast: formData.cast
        .split(",")
        .map((i: string) => i.trim())
        .filter(Boolean),
    };

    try {
      const metaRes = await fetch(`${BACKEND_URL}/movies/${movie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!metaRes.ok) {
        const err = await metaRes.json();
        throw new Error(err.message || "Gagal update metadata");
      }

      for (const imgId of imagesToDelete) {
        await fetch(`${BACKEND_URL}/movies/images/${imgId}`, {
          method: "DELETE",
        });
      }

      const newGalleryFiles = galleryItems.filter(
        (item): item is PendingImage => "isNew" in item,
      );
      if (newGalleryFiles.length > 0) {
        const formData = new FormData();
        newGalleryFiles.forEach((item) =>
          formData.append("screenshot", item.file),
        );
        await fetch(`${BACKEND_URL}/movies/${movie.id}/screenshots`, {
          method: "POST",
          body: formData,
        });
      }

      if (coverFile) {
        const formData = new FormData();
        formData.append("cover", coverFile);
        await fetch(`${BACKEND_URL}/movies/${movie.id}/cover`, {
          method: "PATCH",
          body: formData,
        });
      }

      if (videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        await fetch(`${BACKEND_URL}/movies/${movie.id}/video`, {
          method: "PATCH",
          body: formData,
        });
      }

      toast.success("Perubahan berhasil disimpan");
      router.push(`/movie/${movie.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header
        center={
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Edit Film: {movie.code}
            </h1>
          </div>
        }
      />

      <ImageCropperModal
        isOpen={cropModalOpen}
        imageSrc={rawCoverSrc}
        fileName={rawCoverFileName}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCroppedCoverComplete}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16 space-y-8">
        <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
            Media Film
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative aspect-2/3 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
              {coverPreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={coverPreview}
                    alt="Cover"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700 text-xs px-2 py-1 h-auto"
                      onClick={() => {
                        setRawCoverSrc(coverPreview);
                        setCropModalOpen(true);
                      }}
                    >
                      <Crop className="w-3.5 h-3.5 mr-1" />
                      Crop
                    </Button>
                    <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs flex items-center">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="px-2 py-1 h-auto text-xs"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <p className="text-sm mb-2">Tidak ada cover</p>
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs inline-block">
                    Upload Cover
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="md:col-span-2 relative aspect-video border-2 border-dashed border-slate-700 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
              {videoPreview ? (
                <div className="relative w-full h-full">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs">
                      Replace
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="px-2 py-1 h-auto text-xs"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <p className="text-sm mb-2">Tidak ada video</p>
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs inline-block">
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-white">Gallery / Screenshot</Label>
              <label className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded cursor-pointer text-xs text-white">
                Tambah Foto
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAddGallery}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryItems.map((item, idx) => {
                const src =
                  "isNew" in item
                    ? item.preview
                    : formatMediaUrl(item.file_path);
                return (
                  <div
                    key={idx}
                    className="relative shrink-0 w-32 h-20 rounded overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt="Gallery"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 px-1.5 py-0.5 h-auto text-xs"
                      onClick={() => handleRemoveGallery(idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
              {galleryItems.length === 0 && (
                <p className="text-slate-500 text-sm">Belum ada gallery</p>
              )}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6"
        >
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
            Informasi Utama
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-slate-300">
                Kode Film
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white uppercase"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="title" className="text-slate-300">
                Judul Film
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-300">
                Status
              </Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 text-white px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                {statusOptions.length > 0 ? (
                  statusOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="WATCHED">WATCHED</option>
                    <option value="DELETED">DELETED</option>
                  </>
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="censorship_code" className="text-slate-300">
                Censorship
              </Label>
              <select
                id="censorship_code"
                name="censorship_code"
                value={formData.censorship_code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, censorship_code: e.target.value })
                }
                className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 text-white px-3 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Unknown (Default)</option>
                {censorshipOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview" className="text-slate-300">
              Overview / Deskripsi
            </Label>
            <Textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              rows={4}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="director" className="text-slate-300">
                Director (Pisahkan koma)
              </Label>
              <Input
                id="director"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio" className="text-slate-300">
                Studio (Pisahkan koma)
              </Label>
              <Input
                id="studio"
                name="studio"
                value={formData.studio}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label" className="text-slate-300">
                Label (Pisahkan koma)
              </Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="series" className="text-slate-300">
                Series (Pisahkan koma)
              </Label>
              <Input
                id="series"
                name="series"
                value={formData.series}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-slate-300">
                Genre (Pisahkan koma)
              </Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cast" className="text-slate-300">
                Cast (Pisahkan koma)
              </Label>
              <Input
                id="cast"
                name="cast"
                value={formData.cast}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-700 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Batal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
