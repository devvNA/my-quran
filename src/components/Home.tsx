import { ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { Surah } from "../types";

interface HomeProps {
  onSelectSurah: (id: number) => void;
}

export default function Home({ onSelectSurah }: HomeProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching surahs:", err);
        setLoading(false);
      });
  }, []);

  const filteredSurahs = surahs.filter((s) =>
    s.namaLatin.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-[#018ead] px-5 pt-8 pb-6 rounded-b-[2rem] shadow-md relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Assalamu&apos;alaikum
              </p>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                My Qur&apos;an
              </h1>
              <p className="text-xs font-medium text-white/70 mt-1">by devit</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center bg-white rounded-full px-4 py-3 shadow-inner">
            <Search className="w-5 h-5 text-[#018ead] mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Surah..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#018ead]"></div>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {filteredSurahs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-center">
                  No surah found matching &quot;{search}&quot;
                </p>
              </div>
            ) : (
              filteredSurahs.map((surah) => (
                <div
                  key={surah.nomor}
                  onClick={() => onSelectSurah(surah.nomor)}
                  className="flex items-center py-4 px-2 -mx-2 rounded-lg border-b border-gray-200 cursor-pointer hover:bg-white transition-colors"
                >
                  <div className="w-12 text-1xl font-semibold text-[#018ead]">
                    {surah.nomor}.
                  </div>
                  <div className="flex-1 ml-1">
                    <h3 className="text-base font-semibold text-gray-900 leading-tight">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {surah.tempatTurun === "Mekah" ? "Makkah" : "Madinah"} •{" "}
                      {surah.jumlahAyat} Ayat
                    </p>
                  </div>
                  <div className="text-right mr-3">
                    <p
                      className="text-sm font-medium text-[#018ead] font-arabic"
                      dir="rtl"
                    >
                      {surah.nama}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{surah.arti}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
