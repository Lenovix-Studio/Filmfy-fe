"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import { toast } from "sonner";

interface FilmFormData {
  code: string;
  title: string;
  status: string;
  overview: string;
  director: string;
  studio: string;
  label: string;
  genres: string;
  cast: string;
  series: string;
}

export default function UploadPage() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("media");
  const [statusOptions, setStatusOptions] = useState<
    { id: string; label: string }[]
  >([]);

  const [formData, setFormData] = useState<FilmFormData>({
    code: "",
    title: "",
    status: "",
    overview: "",
    director: "",
    studio: "",
    label: "",
    genres: "",
    cast: "",
    series: "",
  });

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`${BACKEND_URL}/common-codes/STATUS/details`);
        if (res.ok) {
          const result = await res.json();
          const arrayData = Array.isArray(result) ? result : result?.data || [];
          const activeStatus = arrayData
            .filter(
              (item: any) =>
                item.is_active !== false &&
                (item.code === "WATCHED" || item.code === "DELETED"),
            )
            .sort((a: any, b: any) => a.order - b.order);

          const options = activeStatus.map((item: any) => ({
            id: item.code,
            label: item.label,
          }));

          setStatusOptions(options);

          if (options.length > 0) {
            setFormData((prev) => ({
              ...prev,
              status: prev.status || options[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Gagal mengambil status", error);
      }
    }
    fetchStatus();
  }, []);

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

    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const parseCommaSeparated = (value: string) => {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.code.trim()) {
      toast.error("Code wajib diisi!");
      setActiveTab("metadata");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      if (coverFile) data.append("cover", coverFile);
      if (videoFile) data.append("video", videoFile);

      data.append("code", formData.code.trim());
      data.append("title", formData.title.trim() || formData.code.trim());
      data.append("overview", formData.overview.trim());
      if (formData.status) data.append("status", formData.status);

      const directorArray = parseCommaSeparated(formData.director);
      directorArray.forEach((d) => data.append("director", d));

      const studioArray = parseCommaSeparated(formData.studio);
      studioArray.forEach((s) => data.append("studio", s));

      const labelArray = parseCommaSeparated(formData.label);
      labelArray.forEach((l) => data.append("label", l));

      const seriesArray = parseCommaSeparated(formData.series);
      seriesArray.forEach((s) => data.append("series", s));

      const castArray = parseCommaSeparated(formData.cast);
      castArray.forEach((c) => data.append("cast", c));

      const genreArray = parseCommaSeparated(formData.genres);
      genreArray.forEach((g) => data.append("genre", g));

      const response = await fetch(`${BACKEND_URL}/movies/upload`, {
        method: "POST",
        body: data,
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch {}

      if (!response.ok) {
        throw new Error(
          result?.message || `Upload gagal dengan status ${response.status}`,
        );
      }

      toast.success(result?.message || "Film berhasil diunggah!");

      setFormData({
        code: "",
        title: "",
        status: "",
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
      setVideoPreview(null);
      setActiveTab("media");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengunggah film.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header
        center={<h1>Upload Film</h1>}
        right={
          <div className="flex items-center gap-2">
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

            <TabsContent value="media" className="mt-0 outline-none">
              <div className="grid sm:grid-cols-3 gap-6 h-160">
                {/* COVER */}
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

                {/* VIDEO */}
                <div className="flex flex-col col-span-2 h-full">
                  <div className="relative flex-1 border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl bg-slate-50/80 hover:bg-rose-50/30 flex items-center justify-center p-2 transition-all group overflow-hidden">
                    {videoPreview ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-lg">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-full object-contain rounded-lg shadow-sm"
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
            </TabsContent>

            <TabsContent
              value="metadata"
              className="mt-0 outline-none space-y-4"
            >
              <Card className="bg-white border-slate-200 shadow-sm rounded-xl px-0">
                <CardContent className="p-6">
                  <div className="grid grid-cols-5 gap-3">
                    {/* CODE */}
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

                    {/* TITLE */}
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

                    {/* Status */}
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

                    {/* Sinopsis */}
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
                    {/* DIRECTOR */}
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

                    {/* STUDIO */}
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

                    {/* LABEL */}
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

                    {/* SERIES */}
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

                    {/* CAST */}
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

                    {/* GENRES */}
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
      </div>
    </div>
  );
}
