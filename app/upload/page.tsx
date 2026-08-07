"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface FilmFormData {
  code: string;
  title: string;
  director: string;
  studio: string;
  label: string;
  genres: string;
  cast: string;
  series: string;
}

export default function UploadPage() {
  const [formData, setFormData] = useState<FilmFormData>({
    code: "",
    title: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!coverFile) {
      alert("Cover film wajib diunggah!");
      return;
    }

    if (!formData.code || !formData.title) {
      alert("Code dan Title wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("cover", coverFile);
      if (videoFile) data.append("video", videoFile);

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      console.log("Sending Form Data:", Object.fromEntries(data.entries()));
      alert("Film berhasil diunggah!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal mengunggah film.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 p-4 lg:p-6 flex flex-col justify-between overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Upload Film Baru</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs font-medium transition"
          >
            Batal
          </button>
          <button
            type="submit"
            form="upload-form"
            disabled={isSubmitting}
            className="px-5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50 transition"
          >
            {isSubmitting ? "Mengunggah..." : "Simpan Film"}
          </button>
        </div>
      </div>

      {/* MAIN FORM GRID (Fits inside viewport) */}
      <form
        id="upload-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-12 gap-4 my-auto h-[calc(100vh-100px)] pt-3"
      >
        {/* LEFT COLUMN: Cover & Video File (4 Cols) */}
        <div className="col-span-4 flex flex-col gap-3 h-full">
          {/* Cover Dropzone */}
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold mb-1 text-gray-300">
              Cover Film <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1 border border-dashed border-gray-700 hover:border-blue-500 rounded-lg bg-gray-900/60 flex items-center justify-center p-2 text-center transition">
              {coverPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs hover:bg-red-700 flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-xs font-medium text-gray-300">
                    Upload Gambar Cover
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    PNG, JPG, WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    required
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Video Dropzone */}
          <div className="h-28 flex flex-col">
            <label className="block text-xs font-semibold mb-1 text-gray-300">
              File Video Film
            </label>
            <div className="flex-1 border border-dashed border-gray-700 hover:border-blue-500 rounded-lg bg-gray-900/60 flex items-center justify-center p-2 transition">
              <label className="cursor-pointer flex flex-col items-center justify-center w-full">
                <span className="text-xl mb-0.5">🎬</span>
                <span className="text-xs font-medium text-gray-300 truncate max-w-50">
                  {videoFile ? videoFile.name : "Pilih File Video"}
                </span>
                <span className="text-[10px] text-gray-500">
                  {videoFile
                    ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB`
                    : "MP4, MKV, AVI, WebM"}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Metadata Input Form (8 Cols) */}
        <div className="col-span-8 bg-gray-900/40 border border-gray-800 rounded-lg p-4 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Informasi Metadata
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Code */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="misal: FLM-001"
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Judul Film"
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Director */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  placeholder="Sutradara"
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Studio */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Studio
                </label>
                <input
                  type="text"
                  name="studio"
                  value={formData.studio}
                  onChange={handleInputChange}
                  placeholder="Studio Produksi"
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="Label / Distributor"
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Series */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Series
                </label>
                <input
                  type="text"
                  name="series"
                  value={formData.series}
                  onChange={handleInputChange}
                  placeholder="Waralaba / Seri"
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Cast */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Cast
                </label>
                <textarea
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Daftar pemeran (pisahkan koma)"
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Genre / Tag */}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Genre / Tag
                </label>
                <input
                  type="text"
                  name="genres"
                  value={formData.genres}
                  onChange={handleInputChange}
                  placeholder="Action, Sci-Fi, Drama (pisahkan koma)"
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
