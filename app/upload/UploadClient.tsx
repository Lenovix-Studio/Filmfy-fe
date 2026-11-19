"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
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
  Sparkles,
  X,
  Crop,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BACKEND_URL } from "@/lib/constant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import ImageCropperModal from "@/components/ImageCropperModal";
import Image from "next/image";

interface UploadClientProps {
  statusOptions: { id: string; label: string }[];
  censorshipOptions: { id: string; label: string }[];
}

export default function UploadClient({
  statusOptions,
  censorshipOptions,
}: UploadClientProps) {
  const router = useRouter();
  const uploadToastIdRef = useRef<string | number | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("media");
  const [extractCode, setExtractCode] = useState("");
  const [extractUrl, setExtractUrl] = useState("");
  const [extractHeadless, setExtractHeadless] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractModalOpen, setExtractModalOpen] = useState(false);

  // Crop Modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawCoverSrc, setRawCoverSrc] = useState<string | null>(null);
  const [rawCoverFileName, setRawCoverFileName] = useState("cover.jpg");

  const abortControllerRef = useRef<AbortController | null>(null);
  const extractAbortControllerRef = useRef<AbortController | null>(null);
  const [formData, setFormData] = useState<FilmFormData>({
    code: "",
    title: "",
    status: statusOptions[0]?.id || "",
    censorship_code: "",
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

  const videoPreviewRef = useRef<string | null>(null);
  useEffect(() => {
    videoPreviewRef.current = videoPreview;
  }, [videoPreview]);

  useEffect(() => {
    return () => {
      if (videoPreviewRef.current) URL.revokeObjectURL(videoPreviewRef.current);
    };
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      ) &&
      !file.name.toLowerCase().endsWith(".gif")
    ) {
      toast.error("Cover harus JPG/PNG/WEBP/GIF");
      return;
    }

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

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024 * 1024) {
        toast.error("Video max 15GB");
        return;
      }

      const isSupportedType =
        ["video/mp4", "video/webm"].includes(file.type) ||
        file.name.toLowerCase().endsWith(".mp4") ||
        file.name.toLowerCase().endsWith(".webm");

      if (!isSupportedType) {
        toast.error("Format video harus MP4 atau WebM (streaming web)");
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

  const handleExtract = async () => {
    if (!extractCode.trim() && !extractUrl.trim()) {
      toast.error("Masukkan Kode Film atau Target URL terlebih dahulu");
      return;
    }

    const controller = new AbortController();
    extractAbortControllerRef.current = controller;
    setExtracting(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/movies/extract`,
        {
          code: extractCode.trim() || undefined,
          trailer_url: extractUrl.trim() || undefined,
          headless: extractHeadless,
        },
        {
          signal: controller.signal,
        },
      );

      const data = res.data;
      if (data) {
        setFormData((prev) => ({
          ...prev,
          code: data.code || prev.code || extractCode.trim(),
          title: data.title || prev.title,
          overview: data.overview || prev.overview,
          country: data.country || prev.country,
          language: data.language || prev.language,
          release_date: data.release_date || prev.release_date,
          director: data.directors?.join(", ") || prev.director,
          studio: data.studios?.join(", ") || prev.studio,
          label: data.labels?.join(", ") || prev.label,
          series: data.series?.join(", ") || prev.series,
          genres: data.genres?.join(", ") || prev.genres,
          cast: data.casts?.join(", ") || prev.cast,
        }));

        if (data.cover_url) {
          try {
            const coverRes = await fetch(data.cover_url);
            const blob = await coverRes.blob();
            const objectUrl = URL.createObjectURL(blob);
            setRawCoverFileName("extracted_cover.jpg");
            setRawCoverSrc(objectUrl);
            setCropModalOpen(true);
          } catch (e) {
            console.error("Gagal mendownload cover:", e);
          }
        }

        if (data.trailer_url) {
          try {
            const videoRes = await fetch(data.trailer_url);
            const blob = await videoRes.blob();
            const file = new File([blob], "trailer.mp4", {
              type: blob.type || "video/mp4",
            });
            if (videoPreviewRef.current) {
              URL.revokeObjectURL(videoPreviewRef.current);
            }
            const objectUrl = URL.createObjectURL(file);
            setVideoFile(file);
            setVideoPreview(objectUrl);

            const minutes = await getVideoRuntimeMinutes(file);
            if (minutes > 0) {
              setFormData((prev) => ({ ...prev, runtime_minutes: minutes }));
            }
          } catch (e) {
            console.error("Gagal mendownload trailer video:", e);
          }
        }
      }

      setActiveTab("media");
      setExtractModalOpen(false);
      toast.success("Metadata & Trailer berhasil di-extract");
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.code === "ERR_CANCELED"
      ) {
        toast.info("Proses extract dibatalkan");
      } else {
        toast.error(error instanceof Error ? error.message : "Extract gagal");
      }
    } finally {
      setExtracting(false);
      extractAbortControllerRef.current = null;
    }
  };

  const handleCancelExtract = () => {
    if (extractAbortControllerRef.current) {
      extractAbortControllerRef.current.abort();
      extractAbortControllerRef.current = null;
    }
    setExtracting(false);
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

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsSubmitting(false);
    setUploadProgress(0);
    if (uploadToastIdRef.current) {
      toast.dismiss(uploadToastIdRef.current);
      uploadToastIdRef.current = null;
    }
    toast.info("Upload berhasil dibatalkan");
  };

  useEffect(() => {
    if (!isSubmitting || uploadError) {
      return;
    }

    if (!uploadToastIdRef.current) {
      uploadToastIdRef.current = toast.loading("Mengunggah file...", {
        description: `Progress: ${uploadProgress}%`,
        action: {
          label: "Batalkan",
          onClick: () => handleCancelUpload(),
        },
      });
    } else {
      toast.loading("Mengunggah file...", {
        id: uploadToastIdRef.current,
        description: `Progress: ${uploadProgress}%`,
        action: {
          label: "Batalkan",
          onClick: () => handleCancelUpload(),
        },
      });
    }
  }, [isSubmitting, uploadProgress, uploadError]);

  const UploadSchema = z.object({
    code: z.string().min(1, "Kode film wajib diisi"),
  });

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
    setUploadError(null);

    uploadToastIdRef.current = toast.loading("Mengunggah file...", {
      description: "Progress: 0%",
    });

    try {
      const form = new FormData();
      if (coverFile) form.append("cover", coverFile);
      if (videoFile) form.append("video", videoFile);
      form.append("code", formData.code.trim());
      form.append("title", formData.title.trim() || formData.code.trim());
      form.append("overview", formData.overview.trim());
      if (formData.status) form.append("status", formData.status);
      if (formData.censorship_code)
        form.append("censorship_code", formData.censorship_code);
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

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await axios.post(`${BACKEND_URL}/movies/upload`, form, {
        signal: controller.signal,
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

      if (uploadToastIdRef.current) {
        toast.dismiss(uploadToastIdRef.current);
      }
      toast.success("Film berhasil diunggah!");
      router.push(`/movie/${response.data.id}`);
    } catch (error: any) {
      if (
        axios.isCancel(error) ||
        error.name === "CanceledError" ||
        error.code === "ERR_CANCELED"
      ) {
        toast.info("Upload dibatalkan");
      } else if (
        error.response?.status === 503 ||
        error.response?.data?.error === "DatabaseUnavailable"
      ) {
        if (uploadToastIdRef.current) {
          toast.dismiss(uploadToastIdRef.current);
        }
        toast.error("Database sedang mati atau tidak dapat dijangkau!", {
          description: "Silakan periksa server database Anda.",
          duration: 8000,
        });
        setUploadError(
          "Database sedang mati atau tidak dapat dijangkau. Silakan periksa koneksi database.",
        );
      } else {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Gagal mengunggah film";
        setUploadError(Array.isArray(msg) ? msg.join(", ") : msg);
        if (uploadToastIdRef.current) {
          toast.dismiss(uploadToastIdRef.current);
        }
        toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
      }
    } finally {
      setIsSubmitting(false);
      uploadToastIdRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <Header
        center={<h1 className="text-xl font-bold">Upload Film Baru</h1>}
      />

      <ImageCropperModal
        isOpen={cropModalOpen}
        imageSrc={rawCoverSrc}
        fileName={rawCoverFileName}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCroppedCoverComplete}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <TabsTrigger
                  value="media"
                  className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Media & File
                </TabsTrigger>
                <TabsTrigger
                  value="metadata"
                  className="rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Metadata & Detail
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExtractModalOpen(true)}
                  className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Auto-Extract Link
                </Button>

                <Dialog
                  open={extractModalOpen}
                  onOpenChange={setExtractModalOpen}
                >
                  <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                      <DialogTitle>Extract Metadata & Trailer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div>
                        <Label htmlFor="extract_code">Kode Film (Code)</Label>
                        <Input
                          id="extract_code"
                          placeholder="ex. ABW-001"
                          value={extractCode}
                          onChange={(e) => setExtractCode(e.target.value)}
                          className="bg-slate-950 border-slate-800 uppercase"
                        />
                      </div>
                      <div>
                        <Label htmlFor="extract_url">
                          Target URL / Trailer URL
                        </Label>
                        <Input
                          id="extract_url"
                          placeholder="https://..."
                          value={extractUrl}
                          onChange={(e) => setExtractUrl(e.target.value)}
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="headless"
                          checked={extractHeadless}
                          onChange={(e) => setExtractHeadless(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-indigo-600"
                        />
                        <Label
                          htmlFor="headless"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Gunakan Headless Browser (Puppeteer)
                        </Label>
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                      {extracting ? (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleCancelExtract}
                          className="bg-rose-600 hover:bg-rose-700 text-white w-full flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" /> Batalkan Extract
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleExtract}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white w-full"
                        >
                          Mulai Extract
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-indigo-300">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                      <span>{uploadProgress}%</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleCancelUpload}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 shadow-lg shadow-rose-600/20 flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Batalkan Upload
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 shadow-lg shadow-indigo-600/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Film
                  </Button>
                )}
              </div>
            </div>

            {/* TAB MEDIA */}
            <TabsContent value="media" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Upload & Crop */}
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ImageIcon className="text-indigo-400" size={20} />
                        Cover Film
                      </h3>
                      {coverPreview && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setCropModalOpen(true)}
                          className="border-indigo-500/30 text-indigo-400 text-xs"
                        >
                          <Crop className="w-3.5 h-3.5 mr-1" /> Crop Ulang
                        </Button>
                      )}
                    </div>
                    <div className="relative aspect-2/3 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden group">
                      {coverPreview ? (
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="text-center p-6 text-slate-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">Belum ada cover</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="cover_file"
                        className="cursor-pointer block"
                      >
                        <div className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-medium rounded-xl transition-colors border border-slate-700">
                          Pilih File Cover
                        </div>
                      </Label>
                      <Input
                        id="cover_file"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Video Upload */}
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Film className="text-indigo-400" size={20} />
                      File Video Utama (MP4 / WebM)
                    </h3>
                    <div className="relative aspect-video border-2 border-dashed border-slate-700 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden">
                      {videoPreview ? (
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-6 text-slate-500">
                          <Film className="w-12 h-12 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">Belum ada video dipilih</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="video_file"
                        className="cursor-pointer block"
                      >
                        <div className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-medium rounded-xl transition-colors border border-slate-700">
                          Pilih File Video
                        </div>
                      </Label>
                      <Input
                        id="video_file"
                        type="file"
                        accept="video/mp4,video/webm,.mp4,.webm"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gallery Screenshots */}
              <Card className="bg-slate-900/60 border-slate-800">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Galeri / Screenshot Tambahan
                  </h3>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setGalleryFiles((prev) => [...prev, ...files]);
                      setGalleryPreviews((prev) => [
                        ...prev,
                        ...files.map((f) => URL.createObjectURL(f)),
                      ]);
                    }}
                    className="bg-slate-950 border-slate-800"
                  />
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {galleryPreviews.map((preview, i) => (
                        <div
                          key={i}
                          className="relative aspect-video rounded-lg overflow-hidden border border-slate-800"
                        >
                          <Image
                            src={preview}
                            alt="Gallery"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryFiles((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              );
                              setGalleryPreviews((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              );
                            }}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB METADATA */}
            <TabsContent value="metadata" className="space-y-6">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="code">Kode Film *</Label>
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="ex. ABW-001"
                        required
                        className="bg-slate-950 border-slate-800 uppercase"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Judul Film</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Judul lengkap film"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(val) =>
                          handleSelectChange("status", val)
                        }
                      >
                        <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                          {statusOptions.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="censorship_code">Censorship</Label>
                      <Select
                        value={formData.censorship_code || ""}
                        onValueChange={(val) =>
                          handleSelectChange(
                            "censorship_code",
                            val === "UNKNOWN" ? "" : val,
                          )
                        }
                      >
                        <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-100">
                          <SelectValue placeholder="Unknown / Default" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                          <SelectItem value="UNKNOWN">
                            Unknown (Default)
                          </SelectItem>
                          {censorshipOptions.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview / Sinopsis</Label>
                    <Textarea
                      id="overview"
                      name="overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Sinopsis film..."
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="director">Director</Label>
                      <Input
                        id="director"
                        name="director"
                        value={formData.director}
                        onChange={handleInputChange}
                        placeholder="Pisah koma"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="studio">Studio</Label>
                      <Input
                        id="studio"
                        name="studio"
                        value={formData.studio}
                        onChange={handleInputChange}
                        placeholder="Pisah koma"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="Pisah koma"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="series">Series</Label>
                      <Input
                        id="series"
                        name="series"
                        value={formData.series}
                        onChange={handleInputChange}
                        placeholder="Pisah koma"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="genres">Genres</Label>
                      <Input
                        id="genres"
                        name="genres"
                        value={formData.genres}
                        onChange={handleInputChange}
                        placeholder="Pisah koma"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cast">Cast (Pemeran)</Label>
                      <Input
                        id="cast"
                        name="cast"
                        value={formData.cast}
                        onChange={handleInputChange}
                        placeholder="Pisah koma"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="ex. Japan"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Input
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        placeholder="ex. Japanese"
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="release_date">Release Date</Label>
                      <Input
                        id="release_date"
                        name="release_date"
                        type="date"
                        value={formData.release_date}
                        onChange={handleInputChange}
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </main>
    </div>
  );
}
