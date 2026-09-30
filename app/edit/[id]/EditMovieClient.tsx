"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Image as ImageIcon, X, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function EditMovieClient({ movie }: { movie: any }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: movie.title || "",
    code: movie.code || "",
    overview: movie.overview || "",
    director: movie.directors?.map((d: any) => d.name).join(", ") || "",
    studio: movie.studios?.map((s: any) => s.name).join(", ") || "",
    label: movie.labels?.map((l: any) => l.name).join(", ") || "",
    series: movie.series?.map((s: any) => s.name).join(", ") || "",
    genre: movie.genres?.map((g: any) => g.name).join(", ") || "",
    cast: movie.casts?.map((c: any) => c.name).join(", ") || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<any[]>(movie.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      title: formData.title,
      code: formData.code,
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
      const res = await fetch(`${BACKEND_URL}/movies/${movie.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Metadata berhasil diupdate");
        router.push(`/movie/${movie.id}`);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.message || "Gagal update metadata");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadScreenshot = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("screenshot", e.target.files[i]);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/movies/${movie.id}/screenshots`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setImages([...images, ...result.data]);
        toast.success("Screenshot berhasil diunggah");
      } else {
        toast.error("Gagal upload screenshot");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/movies/images/${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages(images.filter((img) => img.id !== imageId));
        toast.success("Gambar dihapus");
      } else {
        toast.error("Gagal menghapus gambar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <>
      <Header
        center={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Edit Film: {movie.title}
            </h1>
          </div>
        }
        right={
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16 space-y-8">
        <form
          id="edit-form"
          onSubmit={handleSubmit}
          className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6"
        >
          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
            Informasi Utama
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-slate-300">
                Kode Film
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
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

          <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3 mt-8">
            Metadata (Pisahkan dengan koma)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="director" className="text-slate-300">
                Sutradara (Director)
              </Label>
              <Input
                id="director"
                name="director"
                value={formData.director}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Christopher Nolan, Quentin Tarantino"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studio" className="text-slate-300">
                Studio
              </Label>
              <Input
                id="studio"
                name="studio"
                value={formData.studio}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Warner Bros, Universal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label" className="text-slate-300">
                Label
              </Label>
              <Input
                id="label"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Legendary Pictures"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="series" className="text-slate-300">
                Seri (Series)
              </Label>
              <Input
                id="series"
                name="series"
                value={formData.series}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Inception Collection"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-slate-300">
                Genre
              </Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Action, Sci-Fi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cast" className="text-slate-300">
                Pemeran (Cast)
              </Label>
              <Input
                id="cast"
                name="cast"
                value={formData.cast}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Leonardo DiCaprio, Elliot Page"
              />
            </div>
          </div>
        </form>

        <section className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Gambar & Screenshot
              </h2>
              <p className="text-sm text-slate-400">
                Kelola cover, poster, dan tambahkan screenshot.
              </p>
            </div>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUploadScreenshot}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <ImageIcon className="w-4 h-4 mr-2" /> Tambah Screenshot
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
              >
                <Image
                  src={formatMediaUrl(img.file_path)}
                  alt={img.image_type}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-600 rounded text-white shadow-sm">
                      {img.image_type}
                    </span>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
