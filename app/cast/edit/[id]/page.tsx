"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { CastDetailBackend } from "@/lib/types";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

type ExistingImage = {
  id: string;
  file_path: string;
  image_type: string;
};

interface SocialMediaItem {
  id?: string;
  platform: string;
  handle: string;
  url?: string;
}

export default function CastEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<CastDetailBackend | null>(null);
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryItems, setGalleryItems] = useState<
    (ExistingImage | { file: File; preview: string })[]
  >([]);

  useEffect(() => {
    if (!id) return;
    fetch(`${BACKEND_URL}/casts/${id}`)
      .then((res) => res.json())
      .then((resData: CastDetailBackend) => {
        setData(resData);
        if (resData.images) {
          setGalleryItems(resData.images);
        }
        if (resData.social_media) {
          setSocialMedia(
            resData.social_media.map((s) => ({
              id: s.id,
              platform: s.platform,
              handle: s.handle,
              url: s.url ?? undefined,
            })),
          );
        }
      })
      .catch(() => setError("Gagal memuat data cast"));
  }, [id]);

  const baseUrl = STORAGE_URL || "";
  const formatUrl = (path: string) => {
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${baseUrl}/${clean}`;
  };

  const toInputDate = (dateVal?: string | null) => {
    if (!dateVal) return "";
    return new Date(dateVal).toISOString().split("T")[0];
  };

  if (!data) {
    return (
      <>
        <Header center={<h1 className="text-2xl font-bold">Edit Cast</h1>} />
        <main className="max-w-4xl mx-auto p-4">
          <p>{error || "Memuat..."}</p>
        </main>
      </>
    );
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setData({
      ...data,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    });
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles((prev) => [...prev, ...files]);
    const newItems = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setGalleryItems((prev) => [...prev, ...newItems]);
  };

  const removeGallery = (i: number) => {
    const item = galleryItems[i];
    if ("preview" in item) URL.revokeObjectURL(item.preview);
    setGalleryItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addSocialMedia = () => {
    setSocialMedia((prev) => [
      ...prev,
      { platform: "Instagram", handle: "", url: "" },
    ]);
  };

  const updateSocialMedia = (
    index: number,
    field: keyof SocialMediaItem,
    val: string,
  ) => {
    setSocialMedia((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)),
    );
  };

  const removeSocialMedia = (index: number) => {
    setSocialMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`${BACKEND_URL}/casts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name ?? "",
          display_name: data.display_name ?? "",
          other_name: data.other_name ?? "",
          bio: data.bio ?? "",
          birth_date: data.birth_date ? data.birth_date : null,
          birth_place: data.birth_place ?? null,
          height: data.height ? Number(data.height) : null,
          body_notes: data.body_notes ?? null,
          bust: data.bust ? Number(data.bust) : null,
          cup: data.cup ?? null,
          waist: data.waist ? Number(data.waist) : null,
          hip: data.hip ? Number(data.hip) : null,
          agency: data.agency ?? null,
          debut_date: data.debut_date ? data.debut_date : null,
          social_media: socialMedia.filter(
            (s) => s.platform.trim() && s.handle.trim(),
          ),
        }),
      });

      if (profileFile) {
        const formData = new FormData();
        formData.append("profile", profileFile);
        await fetch(`${BACKEND_URL}/casts/${id}/profile`, {
          method: "POST",
          body: formData,
        });
      }

      for (const f of galleryFiles) {
        const formData = new FormData();
        formData.append("photo", f);
        await fetch(`${BACKEND_URL}/casts/${id}/photos`, {
          method: "POST",
          body: formData,
        });
      }

      router.push(`/cast/${id}`);
    } catch {
      setError("Gagal menyimpan cast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header center={<h1 className="text-2xl font-bold">Edit Cast</h1>} />
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <section className="space-y-3 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold">Foto Profile</h2>
            <div className="flex items-center gap-4">
              {profilePreview || data.profile_path ? (
                <Image
                  src={profilePreview || formatUrl(data.profile_path!)}
                  alt="Profile preview"
                  width={140}
                  height={140}
                  className="rounded-xl object-cover w-32 h-32 border border-slate-700"
                  unoptimized
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  No Image
                </div>
              )}
              <div>
                <Label htmlFor="profile" className="block mb-1">
                  Upload foto profile
                </Label>
                <Input
                  id="profile"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                />
              </div>
            </div>
          </section>

          {/* Biodata */}
          <section className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold">Biodata & Fakta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={data.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  value={data.display_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="other_name">Other Name / Nama Lain</Label>
                <Input
                  id="other_name"
                  name="other_name"
                  value={data.other_name || ""}
                  onChange={handleInputChange}
                  placeholder="ex. 별칭, Kanji, etc."
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Description / Fact / Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={data.bio || ""}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Deskripsi atau fakta mengenai cast..."
                />
              </div>
            </div>
          </section>

          {/* Career & Origin */}
          <section className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold">Kelahiran & Karier</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth_date">Birth Date (Tanggal Lahir)</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={toInputDate(data.birth_date)}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="birth_place">
                  Birth Location / Nationality
                </Label>
                <Input
                  id="birth_place"
                  name="birth_place"
                  value={data.birth_place || ""}
                  onChange={handleInputChange}
                  placeholder="ex. Tokyo, Japan"
                />
              </div>
              <div>
                <Label htmlFor="agency">Agency</Label>
                <Input
                  id="agency"
                  name="agency"
                  value={data.agency || ""}
                  onChange={handleInputChange}
                  placeholder="ex. Bstar"
                />
              </div>
              <div>
                <Label htmlFor="debut_date">Debut Date</Label>
                <Input
                  id="debut_date"
                  name="debut_date"
                  type="date"
                  value={toInputDate(data.debut_date)}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          {/* Body & Measurements */}
          <section className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold">
              Tubuh & Ukuran (Three Sizes)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={data.height ?? ""}
                  onChange={handleInputChange}
                  placeholder="ex. 164"
                />
              </div>
              <div>
                <Label htmlFor="body_notes">Body Info / Notes</Label>
                <Input
                  id="body_notes"
                  name="body_notes"
                  value={data.body_notes || ""}
                  onChange={handleInputChange}
                  placeholder="ex. left-handed, slim"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <Label htmlFor="bust">Bust (cm)</Label>
                <Input
                  id="bust"
                  name="bust"
                  type="number"
                  value={data.bust ?? ""}
                  onChange={handleInputChange}
                  placeholder="ex. 92"
                />
              </div>
              <div>
                <Label htmlFor="cup">Cup</Label>
                <Input
                  id="cup"
                  name="cup"
                  value={data.cup || ""}
                  onChange={handleInputChange}
                  placeholder="ex. I"
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  name="waist"
                  type="number"
                  value={data.waist ?? ""}
                  onChange={handleInputChange}
                  placeholder="ex. 59"
                />
              </div>
              <div>
                <Label htmlFor="hip">Hip (cm)</Label>
                <Input
                  id="hip"
                  name="hip"
                  type="number"
                  value={data.hip ?? ""}
                  onChange={handleInputChange}
                  placeholder="ex. 89"
                />
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Social Media</h2>
                <p className="text-xs text-slate-400">
                  Bisa ditambah, dikurangi, atau dikosongkan.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialMedia}
                className="flex items-center gap-1"
              >
                <Plus size={14} /> Tambah Sosmed
              </Button>
            </div>

            {socialMedia.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                Belum ada media sosial ditambahkan.
              </p>
            ) : (
              <div className="space-y-3">
                {socialMedia.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-2"
                  >
                    <Input
                      className="sm:w-36"
                      placeholder="Platform (ex. Instagram)"
                      value={item.platform}
                      onChange={(e) =>
                        updateSocialMedia(idx, "platform", e.target.value)
                      }
                    />
                    <Input
                      className="flex-1"
                      placeholder="Handle / Username (ex. @username)"
                      value={item.handle}
                      onChange={(e) =>
                        updateSocialMedia(idx, "handle", e.target.value)
                      }
                    />
                    <Input
                      className="flex-1"
                      placeholder="URL Lengkap (opsional)"
                      value={item.url || ""}
                      onChange={(e) =>
                        updateSocialMedia(idx, "url", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialMedia(idx)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 shrink-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Photos Gallery */}
          <section className="space-y-3 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold">Upload Foto Lainnya</h2>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryChange}
            />
            {galleryItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {galleryItems.map((item, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={
                        "file" in item
                          ? item.preview
                          : formatUrl(item.file_path)
                      }
                      alt="gallery"
                      width={300}
                      height={200}
                      className="object-cover rounded w-full h-40"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <p className="text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-semibold"
          >
            <Save size={18} className="mr-2" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </main>
    </>
  );
}
