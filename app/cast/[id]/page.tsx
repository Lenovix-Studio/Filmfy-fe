import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BACKEND_URL, STORAGE_URL } from "@/lib/constant";
import { CastDetailBackend } from "@/lib/types";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCast(id: string): Promise<CastDetailBackend | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/casts/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CastPage({ params }: { params: { id: string } }) {
  const cast = await getCast(params.id);
  if (!cast) notFound();

  const format = (path: string) => {
    if (!path) return "";
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${STORAGE_URL}/${clean}`;
  };

  return (
    <>
      <Header center={<h1 className="text-2xl font-bold">{cast.name}</h1>} />
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {cast.profile_path && (
          <Image
            src={format(cast.profile_path)}
            alt={cast.name}
            width={200}
            height={200}
            className="rounded-full"
          />
        )}
        {cast.bio && <p className="text-lg">{cast.bio}</p>}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cast.images?.map((img) => (
            <Image
              key={img.id}
              src={format(img.file_path)}
              alt="gallery"
              width={300}
              height={200}
              className="object-cover"
            />
          ))}
        </section>
        <Link href={`/cast/edit/${cast.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit size={16} />
            Edit profile
          </Button>
        </Link>
      </main>
    </>
  );
}
