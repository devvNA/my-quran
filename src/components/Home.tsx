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
      <div className="px-5 pt-6 pb-4 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[2.5rem] font-bold italic text-[#018ead] tracking-tight">
              My Qur&apos;an
            </h1>
            <p className="text-xs font-bold text-gray-500 italic mt-1">
              by devit
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-3 mb-5">
          <Search className="w-5 h-5 text-[#018ead] mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Surah..."
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 pb-3 text-center font-semibold text-[#018ead] border-b-[3px] border-[#018ead]">
            Surah
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#018ead]"></div>
          </div>
        ) : (
          <div className="space-y-0 pt-2">
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
