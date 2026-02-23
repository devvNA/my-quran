import { ChevronDown, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SurahDetail } from "../types";

interface SurahDetailViewProps {
  surahId: number;
  onBack: () => void;
}

export default function SurahDetailView({
  surahId,
  onBack,
}: SurahDetailViewProps) {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJumpDropdown, setShowJumpDropdown] = useState(false);
  const [selectedAyat, setSelectedAyat] = useState<number | null>(null);
  const [highlightedAyat, setHighlightedAyat] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${surahId}`)
      .then((res) => res.json())
      .then((data) => {
        setSurah(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching surah detail:", err);
        setLoading(false);
      });
  }, [surahId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowJumpDropdown(false);
      }
    };

    if (showJumpDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showJumpDropdown]);

  const handleJumpToAyat = (ayatNumber: number) => {
    if (surah && ayatNumber > 0 && ayatNumber <= surah.jumlahAyat) {
      const element = document.getElementById(`ayat-${ayatNumber}`);
      if (element && scrollContainerRef.current) {
        const containerTop =
          scrollContainerRef.current.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const currentScroll = scrollContainerRef.current.scrollTop;

        scrollContainerRef.current.scrollTo({
          top: currentScroll + elementTop - containerTop - 20,
          behavior: "smooth",
        });
      }
      setSelectedAyat(ayatNumber);
      setHighlightedAyat(ayatNumber);
      setShowJumpDropdown(false);

      // Auto-remove highlight after animation
      setTimeout(() => {
        setHighlightedAyat(null);
      }, 4500);
    }
  };

  if (loading || !surah) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="bg-[#018ead] text-white pt-4 pb-4 px-4 flex items-center justify-between z-20 shadow-sm">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="flex items-center p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">My Qur&apos;an</h1>
          <div className="w-10" />
        </div>
        {/* Loading State */}
        <div className="flex-1 flex justify-center items-center bg-gray-50">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-[#018ead]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-[#018ead] text-white pt-4 pb-4 px-4 flex items-center justify-between z-20 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">My Qur&apos;an</h1>
        <div className="w-10" />
      </div>

      <div
        className="flex-1 overflow-y-auto bg-gray-50"
        ref={scrollContainerRef}
      >
        {/* Hero Section */}
        <div className="px-2 pb-5 flex flex-col items-center relative z-10">
          <div
            className="w-full pt-12 pb-18 px-6 flex flex-col items-center justify-center text-center text-white relative bg-contain bg-no-repeat bg-center drop-shadow-lg"
            style={{ backgroundImage: "url('/background-header.png')" }}
          >
            <h2
              className="text-[2.3rem] font-bold font-arabic leading-tight drop-shadow-md"
              dir="rtl"
            >
              {surah.nama}
            </h2>
            <h3 className="text-[1.2rem] font-semibold mb-0 tracking-wide drop-shadow-md">
              {surah.namaLatin}
            </h3>
            <p className="text-[0.75rem] opacity-90 font-medium drop-shadow-md">
              {surah.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah"} •{" "}
              {surah.jumlahAyat} Ayat
            </p>
          </div>

          {/* Jump to Ayat Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowJumpDropdown(!showJumpDropdown)}
              className="bg-[#018ead] text-white px-5 py-2 rounded-full flex items-center shadow-md -mt-15 relative z-100 border-[1px] border-white hover:shadow-lg hover:brightness-110 transition-all"
            >
              <span className="text-sm font-medium">
                {selectedAyat ? `Ayat ${selectedAyat}` : "Ayat"}
              </span>
              <ChevronDown
                className={`w-4 h-4 ml-1.5 transition-transform ${showJumpDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showJumpDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 -mt-4 rounded-xl shadow-xl z-30 max-h-64 overflow-y-auto w-56">
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-2 text-center font-medium">
                    Select Ayat Number
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from(
                      { length: surah.jumlahAyat },
                      (_, i) => i + 1,
                    ).map((ayatNum) => (
                      <button
                        key={ayatNum}
                        onClick={() => handleJumpToAyat(ayatNum)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedAyat === ayatNum
                            ? "bg-[#018ead] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {ayatNum}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ayat List */}
        <div className="px-5 pb-12">
          {surah.ayat.map((ayah) => (
            <div
              key={ayah.nomorAyat}
              id={`ayat-${ayah.nomorAyat}`}
              className={`py-6 border-b border-gray-200 last:border-0 ${
                highlightedAyat === ayah.nomorAyat ? "ayat-highlight" : ""
              }`}
            >
              {/* Ayat Header with Number */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-9 h-9 rounded-full bg-[#018ead] text-white flex items-center justify-center text-[0.9rem] font-medium shrink-0 shadow-sm">
                  {ayah.nomorAyat}
                </div>
                <div className="flex-1 ml-4 text-right">
                  <p
                    className="text-3xl leading-loose font-arabic text-gray-900"
                    dir="rtl"
                  >
                    {ayah.teksArab}
                  </p>
                </div>
              </div>

              {/* Ayat Content */}
              <div className="pl-13 space-y-2">
                <p className="text-[#018ead] italic leading-relaxed text-[1.05rem]">
                  {ayah.teksLatin}
                </p>
                <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                  {ayah.teksIndonesia}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
