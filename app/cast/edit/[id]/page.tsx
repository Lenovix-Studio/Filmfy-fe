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
import { Save, X } from "lucide-react";
import Image from "next/image";

type ExistingImage = {
  id: string;
  file_path: string;
  image_type: string;
};

export default function CastEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<CastDetailBackend | null>(null);
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
      .then((resData) => {
        setData(resData);
        if (resData.images) {
          setGalleryItems(resData.images);
        }
      })
      .catch(() => setError("Gagal memuat data cast"));
  }, [id]);

  const baseUrl = STORAGE_URL || "";
  const formatUrl = (path: string) => {
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${baseUrl}/${clean}`;
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
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
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

  const { name, display_name, other_name, bio } = data;

  return (
    <>
      <Header center={<h1 className="text-2xl font-bold">Edit Cast</h1>} />
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Foto Profile</h2>
            <div className="flex items-center gap-4">
              {profilePreview || data.profile_path ? (
                <Image
                  src={profilePreview || formatUrl(data.profile_path!)}
                  alt="Profile preview"
                  width={200}
                  height={200}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-50 h-50 rounded-full bg-gray-200" />
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

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Biodata</h2>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  value={display_name || ""}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500">
                  Nama yang muncul di list cast di website Filmfy
                </p>
              </div>
              <div>
                <Label htmlFor="other_name">Other name</Label>
                <Input
                  id="other_name"
                  name="other_name"
                  value={other_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={bio || ""}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
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
                      className="object-cover rounded"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            <Save size={16} className="mr-2" />
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </main>
    </>
  );
}
