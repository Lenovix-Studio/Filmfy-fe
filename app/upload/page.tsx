"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X, Image as ImageIcon, Film, Upload, Settings } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

interface FilmFormData {
  code: string;
  title: string;
  overview: string;
  director: string;
  studio: string;
  label: string;
  genres: string;
  cast: string;
  series: string;
}

interface UploadResponse {
  statusCode: number;
  message: string;
  data?: {
    id: string;
    code: string;
    title: string;
    original_title: string | null;
    overview: string | null;
    release_date: string | null;
    runtime_minutes: number | null;
    language: string | null;
    country: string | null;
    tmdb_id: number | null;
    imdb_id: string | null;
    created_at: string;
    updated_at: string;
  };
}

const API_URL = "http://localhost:3001";

export default function UploadPage() {
  const [formData, setFormData] = useState<FilmFormData>({
    code: "",
    title: "",
    overview: "",
    director: "",
    studio: "",
    label: "",
    genres: "",
    cast: "",
    series: "",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setVideoFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Validation
    if (!coverFile) {
      alert("Cover film wajib diunggah!");
      return;
    }

    if (!formData.code.trim()) {
      alert("Code wajib diisi!");
      return;
    }

    if (!formData.title.trim()) {
      alert("Title wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      // =========================
      // FILE
      // =========================

      data.append("cover", coverFile);

      if (videoFile) {
        data.append("video", videoFile);
      }

      // =========================
      // METADATA
      // =========================

      data.append("code", formData.code.trim());
      data.append("title", formData.title.trim());
      data.append("overview", formData.overview.trim());

      if (formData.director.trim()) {
        data.append("director", formData.director.trim());
      }

      if (formData.studio.trim()) {
        data.append("studio", formData.studio.trim());
      }

      if (formData.label.trim()) {
        data.append("label", formData.label.trim());
      }

      if (formData.series.trim()) {
        data.append("series", formData.series.trim());
      }

      if (formData.cast.trim()) {
        data.append("cast", formData.cast.trim());
      }

      // IMPORTANT:
      // Backend menggunakan field "genre", bukan "genres"
      if (formData.genres.trim()) {
        data.append("genre", formData.genres.trim());
      }

      console.log("Uploading film...");

      const response = await fetch(`${API_URL}/movies/upload`, {
        method: "POST",
        body: data,
      });

      let result: UploadResponse | null = null;

      try {
        result = await response.json();
      } catch {
        // Backend mungkin mengembalikan response
        // yang bukan JSON.
      }

      if (!response.ok) {
        const errorMessage =
          result?.message || `Upload gagal dengan status ${response.status}`;

        throw new Error(errorMessage);
      }

      console.log("Upload success:", result);

      alert(result?.message || "Film berhasil diunggah!");

      // Reset form setelah berhasil
      setFormData({
        code: "",
        title: "",
        overview: "",
        director: "",
        studio: "",
        label: "",
        genres: "",
        cast: "",
        series: "",
      });

      setCoverFile(null);
      setCoverPreview(null);
      setVideoFile(null);

      // Reset input file
      const coverInput = document.getElementById(
        "cover-input",
      ) as HTMLInputElement | null;

      const videoInput = document.getElementById(
        "video-input",
      ) as HTMLInputElement | null;

      if (coverInput) {
        coverInput.value = "";
      }

      if (videoInput) {
        videoInput.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengunggah film.";

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <Navbar
        leftMode="back"
        rightActions={
          <div className="flex items-center gap-2">
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

      <div className="min-h-[calc(100vh-65px)] max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* MAIN FORM GRID */}
        <form
          id="upload-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-12 gap-4 my-auto pt-3"
        >
          {/* LEFT COLUMN */}
          <div className="col-span-4 flex flex-col gap-3 h-full">
            {/* COVER */}
            <div className="flex-1 flex flex-col">
              <div className="relative flex-1 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl bg-slate-50/80 hover:bg-rose-50/30 flex items-center justify-center p-2 text-center transition-all group">
                {coverPreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={coverPreview}
                      alt="Cover Preview"
                      className="w-full h-full object-contain rounded-lg shadow-sm"
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);

                        const input = document.getElementById(
                          "cover-input",
                        ) as HTMLInputElement | null;

                        if (input) {
                          input.value = "";
                        }
                      }}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-4">
                    <div className="p-3 bg-white rounded-full shadow-xs mb-2 border border-slate-200 group-hover:border-rose-200 transition-colors">
                      <ImageIcon className="h-6 w-6 text-slate-500 group-hover:text-rose-600 transition-colors" />
                    </div>

                    <Label
                      className="text-base font-semibold text-slate-800 group-hover:text-rose-600 transition-colors"
                      required
                    >
                      Upload Gambar Cover
                    </Label>

                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                      PNG, JPG, WEBP
                    </span>

                    <input
                      id="cover-input"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      required
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* VIDEO */}
            <div className="h-28 flex flex-col">
              <div className="flex-1 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl bg-slate-50/80 hover:bg-rose-50/30 flex items-center justify-center p-2 transition-all group">
                <Label className="cursor-pointer flex flex-col items-center justify-center w-full">
                  <Film className="h-5 w-5 mb-1 text-slate-500 group-hover:text-rose-600 transition-colors" />
                  <Label
                    className="text-base font-medium text-slate-800 group-hover:text-rose-600 transition-colors truncate max-w-50"
                    required
                  >
                    {videoFile ? videoFile.name : "Pilih File Video"}
                  </Label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {videoFile
                      ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB`
                      : "MP4, MKV, AVI, WebM"}
                  </span>

                  <input
                    id="video-input"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </Label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-8 flex flex-col gap-3 h-full">
            {/* Metadata info */}
            <Card className="flex flex-col justify-between bg-white border-slate-300 shadow-xs rounded-xl">
              <CardContent className="p-4 pt-4 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3.5">
                  {/* CODE */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="code"
                      className="text-base font-medium text-slate-700"
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
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* TITLE */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="title"
                      className="text-base font-medium text-slate-700"
                      required
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
                      required
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Overview */}
                  <div className="space-y-1 col-span-2">
                    <Label
                      htmlFor="overview"
                      className="text-base font-medium text-slate-700"
                    >
                      Overview
                    </Label>
                    <Textarea
                      id="overview"
                      name="overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                      placeholder="Overview"
                      required
                      disabled={isSubmitting}
                      className="h-30 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Metadata detail */}
            <Card className="col-span-8 flex flex-col justify-betweenbg-white border-slate-300 shadow-xs rounded-xl">
              <CardContent className="p-4 pt-4 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3.5">
                  {/* DIRECTOR */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="director"
                      className="text-base font-medium text-slate-700"
                    >
                      Director
                    </Label>
                    <Input
                      id="director"
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleInputChange}
                      placeholder="Sutradara"
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* STUDIO */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="studio"
                      className="text-base font-medium text-slate-700"
                    >
                      Studio
                    </Label>
                    <Input
                      id="studio"
                      type="text"
                      name="studio"
                      value={formData.studio}
                      onChange={handleInputChange}
                      placeholder="Studio Produksi"
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* LABEL */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="label"
                      className="text-base font-medium text-slate-700"
                    >
                      Label
                    </Label>
                    <Input
                      id="label"
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      placeholder="Label / Distributor"
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* SERIES */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="series"
                      className="text-base font-medium text-slate-700"
                    >
                      Series
                    </Label>
                    <Input
                      id="series"
                      type="text"
                      name="series"
                      value={formData.series}
                      onChange={handleInputChange}
                      placeholder="Waralaba / Seri"
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* CAST */}
                  <div className="col-span-2 space-y-1">
                    <Label
                      htmlFor="cast"
                      className="text-base font-medium text-slate-700"
                    >
                      Cast
                    </Label>
                    <Input
                      id="cast"
                      type="text"
                      name="cast"
                      value={formData.cast}
                      onChange={handleInputChange}
                      placeholder="Daftar pemeran (pisahkan koma)"
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* GENRE */}
                  <div className="col-span-2 space-y-1">
                    <Label
                      htmlFor="genres"
                      className="text-base font-medium text-slate-700"
                    >
                      Genre
                    </Label>
                    <Input
                      id="genres"
                      type="text"
                      name="genres"
                      value={formData.genres}
                      onChange={handleInputChange}
                      placeholder="Action, Sci-Fi, Drama (pisahkan koma)"
                      disabled={isSubmitting}
                      className="h-8 text-base bg-slate-50/50 border-slate-300 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
