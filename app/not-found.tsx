import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-6xl font-extrabold text-indigo-500 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-400 text-sm">
          Halaman atau data film yang Anda cari tidak tersedia atau belum
          terdaftar.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
