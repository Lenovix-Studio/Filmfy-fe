"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Image as ImageIcon,
  Film,
  Upload,
  Settings,
  Sparkles,
  FileText,
  FlaskConical,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { BACKEND_URL, ENV } from "@/lib/constant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import { toast } from "sonner";
import { FilmFormData } from "@/lib/types";

interface UploadClientProps {
  statusOptions: { id: string; label: string }[];
}

export default function UploadClient({ statusOptions }: UploadClientProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("media");
  const [extractLink, setExtractLink] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractModalOpen, setExtractModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FilmFormData>({
    code: "",
    title: "",
    status: statusOptions[0]?.id || "",
    overview: "",
    director: "",
    studio: "",
    label: "",
    genres: "",
    cast: "",
    series: "",
    country: "",
    language: "",
    release_date: "",
    runtime_minutes: 0,
  });

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Cover max 50MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Cover harus JPG/PNG/WEBP");
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024 * 1024) {
        toast.error("Video max 15GB");
        return;
      }

      if (
        ![
          "video/mp4",
          "video/x-matroska",
          "video/webm",
          "video/quicktime",
          "video/x-msvideo",
        ].includes(file.type)
      ) {
        toast.error("Format video tidak didukung");
        return;
      }

      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));

      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const minutes = Math.round(video.duration / 60);
        setFormData((prev) => ({ ...prev, runtime_minutes: minutes }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const parseCommaSeparated = (value: string) => {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDev = ENV;

  const UploadSchema = z.object({
    code: z.string().min(1, "Code wajib diisi"),
  });

  const handleLoadTestData = () => {
    setFormData({
      code: "TST-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      title: "Test Film - Inception",
      status: statusOptions[0]?.id || "",
      overview:
        "This is a test film about dreams within dreams. A skilled thief who specializes in extraction, stealing company secrets from people's subconscious during the dream state, is given the inverse task of planting an idea into the mind of a C.E.O.",
      director: "Christopher Nolan, Denis Villeneuve",
      studio: "Warner Bros, Universal Pictures",
      label: "Legendary Pictures, Syncopy",
      genres: "Sci-Fi, Action, Thriller",
      cast: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy, Ellen Page",
      series: "Nolan Collection",
      country: "USA",
      language: "English",
      release_date: "2010-07-16",
      runtime_minutes: 0,
    });
    setActiveTab("metadata");
    toast.success("Test data berhasil dimuat");
  };

  const handleExtract = async () => {
    if (!extractLink.trim()) {
      toast.error("Code tidak boleh kosong");
      return;
    }

    setExtracting(true);
    setExtractModalOpen(true);
    try {
      const res = await fetch(`${BACKEND_URL}/movies/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: extractLink }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Extract gagal");
      }

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        code: data.code || prev.code,
        title: data.title || prev.title,
        overview: data.overview || prev.overview,
        director: data.director || prev.director,
        studio: data.studio || prev.studio,
        label: data.label || prev.label,
        country: data.country || prev.country,
        language: data.language || prev.language,
        release_date: data.release_date || prev.release_date,
        cast: data.cast || prev.cast,
        runtime_minutes: data.runtime_minutes || prev.runtime_minutes,
        series: data.series || prev.series,
        genres: data.genres || prev.genres,
      }));

      if (data.cover_url) {
        try {
          const proxyUrl = `${BACKEND_URL}/movies/extract/cover?url=${encodeURIComponent(data.cover_url)}`;
          const imageRes = await fetch(proxyUrl);
          const blob = await imageRes.blob();
          const file = new File([blob], `${data.code || "cover"}.jpg`, {
            type: blob.type,
          });
          setCoverFile(file);
          setCoverPreview(URL.createObjectURL(blob));
        } catch (e) {
          console.error("Gagal mendownload cover preview:", e);
        }
      }

      if (data.gallery_urls && Array.isArray(data.gallery_urls)) {
        const newGalleryFiles: File[] = [];
        const newGalleryPreviews: string[] = [];

        for (let i = 0; i < data.gallery_urls.length; i++) {
          const url = data.gallery_urls[i];
          try {
            const proxyUrl = `${BACKEND_URL}/movies/extract/cover?url=${encodeURIComponent(url)}`;
            const imageRes = await fetch(proxyUrl);
            const blob = await imageRes.blob();
            const file = new File(
              [blob],
              `${data.code || "gallery"}_${i}.jpg`,
              { type: blob.type },
            );
            newGalleryFiles.push(file);
            const objectUrl = URL.createObjectURL(blob);
            newGalleryPreviews.push(objectUrl);
          } catch (e) {
            console.error(`Gagal mendownload gallery preview ${i}:`, e);
            newGalleryPreviews.push(url);
          }
        }

        setGalleryFiles(newGalleryFiles);
        setGalleryPreviews(newGalleryPreviews);
      }
      setActiveTab("metadata");
      setExtractModalOpen(false);
      toast.success("Metadata berhasil di-extract");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Extract gagal");
    } finally {
      setExtracting(false);
    }
  };

  const getVideoRuntimeMinutes = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration / 60));
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      UploadSchema.parse({
        code: formData.code,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((e: z.ZodIssue) => toast.error(e.message));
      }
      setActiveTab("metadata");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const form = new FormData();
      if (coverFile) form.append("cover", coverFile);
      if (videoFile) form.append("video", videoFile);
      form.append("code", formData.code.trim());
      form.append("title", formData.title.trim() || formData.code.trim());
      form.append("overview", formData.overview.trim());
      if (formData.status) form.append("status", formData.status);
      if (formData.country) form.append("country", formData.country);
      if (formData.language) form.append("language", formData.language);
      if (formData.release_date)
        form.append("release_date", formData.release_date);

      const runtimeMinutes = videoFile
        ? await getVideoRuntimeMinutes(videoFile)
        : formData.runtime_minutes;
      if (runtimeMinutes > 0)
        form.append("runtime_minutes", runtimeMinutes.toString());

      const directorArray = parseCommaSeparated(formData.director);
      directorArray.forEach((d) => form.append("director", d));
      const studioArray = parseCommaSeparated(formData.studio);
      studioArray.forEach((s) => form.append("studio", s));
      const labelArray = parseCommaSeparated(formData.label);
      labelArray.forEach((l) => form.append("label", l));
      const seriesArray = parseCommaSeparated(formData.series);
      seriesArray.forEach((s) => form.append("series", s));
      const castArray = parseCommaSeparated(formData.cast);
      castArray.forEach((c) => form.append("cast", c));
      const genreArray = parseCommaSeparated(formData.genres);
      genreArray.forEach((g) => form.append("genre", g));

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => form.append("gallery", file));
      }

      const response = await axios.post(`${BACKEND_URL}/movies/upload`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || progressEvent.loaded;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success(response.data?.message ?? "Film berhasil diunggah!");

      setFormData({
        code: "",
        title: "",
        status: statusOptions[0]?.id || "",
        overview: "",
        director: "",
        studio: "",
        label: "",
        genres: "",
        cast: "",
        series: "",
        country: "",
        language: "",
        release_date: "",
        runtime_minutes: 0,
      });
      setCoverFile(null);
      setCoverPreview(null);
      setVideoFile(null);
      setVideoPreview(null);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setActiveTab("media");
    } catch (error: any) {
      console.error("Upload failed:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat mengunggah film.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header
        center={<h1>Upload Film</h1>}
        right={
          <div className="flex items-center gap-2">
            {mounted && isDev && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-xl border-blue-200 hover:bg-blue-50 text-blue-700 shadow-sm flex items-center gap-2"
                disabled={isSubmitting}
                onClick={handleLoadTestData}
              >
                <FlaskConical className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Test Data</span>
              </Button>
            )}

            <Dialog open={extractModalOpen} onOpenChange={setExtractModalOpen}>
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 shadow-sm flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    <span className="hidden sm:inline">Extract</span>
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Extract metadata</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="extract-code">
                    Code
                  </label>
                  <input
                    id="extract-code"
                    type="text"
                    placeholder="misal: EBOD-391"
                    value={extractLink}
                    onChange={(e) => setExtractLink(e.target.value)}
                    className="w-full rounded border p-2"
                    disabled={isSubmitting || extracting}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleExtract}
                    disabled={!extractLink || extracting}
                  >
                    {extracting ? "Extracting..." : "Extract"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              type="submit"
              form="upload-form"
              size="lg"
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSubmitting ? "Mengunggah..." : "Upload"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Link href="../settings" title="Settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-5">
        <form id="upload-form" onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full mb-3 max-w-sm bg-slate-100 p-1 rounded-xl mx-auto grid grid-cols-2">
              <TabsTrigger
                value="media"
                className="rounded-lg flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <Film className="w-4 h-4" />
                <span>Media</span>
              </TabsTrigger>

              <TabsTrigger
                value="metadata"
                className="rounded-lg flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <FileText className="w-4 h-4" />
                <span>Metadata</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="media"
              className="mt-0 outline-none flex flex-col gap-4 h-155"
            >
              {/* Row 1: Cover and Video side by side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-105 shrink-0">
                <div className="flex flex-col h-full">
                  <div className="relative flex-1 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl bg-slate-50/80 hover:bg-rose-50/30 flex items-center justify-center p-2 text-center transition-all group overflow-hidden">
                    {coverPreview ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="w-full h-full object-contain rounded-lg shadow-sm"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/90 p-1.5 rounded-lg shadow-md backdrop-blur-sm border border-slate-200/50">
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCoverChange}
                              disabled={isSubmitting}
                              className="hidden"
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setCoverFile(null);
                              setCoverPreview(null);
                            }}
                            disabled={isSubmitting}
                            className="h-7 px-3 text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-4">
                        <div className="p-3 bg-white rounded-full shadow-xs mb-2 border border-slate-200 group-hover:border-rose-200 transition-colors">
                          <ImageIcon className="h-6 w-6 text-slate-500 group-hover:text-rose-600 transition-colors" />
                        </div>
                        <Label className="text-base font-semibold text-slate-800 group-hover:text-rose-600 transition-colors">
                          Upload Gambar Cover
                        </Label>
                        <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                          PNG, JPG, WEBP (Boleh Kosong)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                          disabled={isSubmitting}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:col-span-2 h-full min-h-0 overflow-hidden">
                  <div className="relative flex-1 h-full min-h-0 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl bg-slate-50/80 hover:bg-rose-50/30 flex items-center justify-center p-2 transition-all group overflow-hidden">
                    {videoPreview ? (
                      <div className="relative w-full h-full max-h-full flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-full max-h-full object-contain rounded-lg shadow-sm"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/90 p-1.5 rounded-lg shadow-md backdrop-blur-sm border border-slate-200/50">
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors">
                            Replace
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoChange}
                              disabled={isSubmitting}
                              className="hidden"
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setVideoFile(null);
                              if (videoPreview)
                                URL.revokeObjectURL(videoPreview);
                              setVideoPreview(null);
                            }}
                            disabled={isSubmitting}
                            className="h-7 px-3 text-xs"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <Film className="h-8 w-8 mb-3 text-slate-500 group-hover:text-rose-600 transition-colors" />
                        <Label className="text-base font-medium text-slate-800 group-hover:text-rose-600 transition-colors truncate max-w-xs px-4 text-center">
                          Pilih File Video
                        </Label>
                        <span className="text-[10px] text-slate-400 font-medium mt-1">
                          MP4, MKV, AVI, WebM (Boleh Kosong)
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          disabled={isSubmitting}
                          className="hidden"
                        />
                      </Label>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Gallery below */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex-1 min-h-0 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Gallery
                  </Label>
                  <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    Tambah Foto
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;

                        const newFiles = [...galleryFiles, ...files];
                        const newPreviews = [...galleryPreviews];

                        files.forEach((file) => {
                          newPreviews.push(URL.createObjectURL(file));
                        });

                        setGalleryFiles(newFiles);
                        setGalleryPreviews(newPreviews);
                      }}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                </div>

                {galleryPreviews.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 flex-1 flex items-center justify-center">
                    Belum ada foto gallery
                  </div>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin flex-1">
                    {galleryPreviews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative shrink-0 w-36 h-24 rounded-lg overflow-hidden border border-slate-200 group"
                      >
                        <img
                          src={url}
                          alt={`gallery-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="xs"
                          className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-80 group-hover:opacity-100 shadow-sm"
                          onClick={() => {
                            try {
                              URL.revokeObjectURL(url);
                            } catch {}
                            setGalleryPreviews((p) =>
                              p.filter((_, i) => i !== idx),
                            );
                            setGalleryFiles((f) =>
                              f.filter((_, i) => i !== idx),
                            );
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="metadata"
              className="mt-0 outline-none space-y-4"
            >
              <Card className="bg-white border-slate-200 shadow-sm rounded-xl px-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-5 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="code"
                        className="text-sm font-semibold text-slate-700"
                        required
                      >
                        Code
                      </Label>
                      <Input
                        id="code"
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="misal: FLM-001"
                        required
                        disabled={isSubmitting}
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-3">
                      <Label
                        htmlFor="title"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Judul Film"
                        disabled={isSubmitting}
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="status"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: val || "",
                          }))
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="bg-slate-50/50 w-full">
                          <SelectValue placeholder="Pilih status film" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 col-span-full">
                      <Label
                        htmlFor="overview"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Sinopsis
                      </Label>
                      <Textarea
                        id="overview"
                        name="overview"
                        value={formData.overview}
                        onChange={handleInputChange}
                        placeholder="Ringkasan cerita film"
                        disabled={isSubmitting}
                        className="h-24 bg-slate-50/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm rounded-xl px-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Director
                      </Label>
                      <Input
                        name="director"
                        value={formData.director}
                        onChange={handleInputChange}
                        placeholder="Pisahkan dengan koma"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Studio
                      </Label>
                      <Input
                        name="studio"
                        value={formData.studio}
                        onChange={handleInputChange}
                        placeholder="Pisahkan dengan koma"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Label
                      </Label>
                      <Input
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="Pisahkan dengan koma"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Country
                      </Label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Contoh: USA, Indonesia"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Language
                      </Label>
                      <Input
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        placeholder="Contoh: English, Indonesian"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Release Date
                      </Label>
                      <Input
                        name="release_date"
                        type="date"
                        value={formData.release_date}
                        onChange={handleInputChange}
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold text-slate-700">
                        Series
                      </Label>
                      <Input
                        name="series"
                        value={formData.series}
                        onChange={handleInputChange}
                        placeholder="Pisahkan dengan koma"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-sm font-semibold text-slate-700">
                        Cast
                      </Label>
                      <Input
                        name="cast"
                        value={formData.cast}
                        onChange={handleInputChange}
                        placeholder="Pisahkan dengan koma"
                        className="bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-sm font-semibold text-slate-700">
                        Genre / Tags
                      </Label>
                      <Input
                        name="genres"
                        value={formData.genres}
                        onChange={handleInputChange}
                        placeholder="Pisahkan dengan koma"
                        className="bg-slate-50/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>

        {isSubmitting && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-6">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Mengunggah...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
