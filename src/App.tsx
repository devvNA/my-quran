import { useEffect, useState } from "react";
import Home from "./components/Home";
import SurahDetailView from "./components/SurahDetailView";

export default function App() {
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);

  // Parse URL hash on mount and when it changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/#\/surah\/(\d+)/);

      if (match) {
        const surahId = parseInt(match[1], 10);
        setCurrentSurahId(surahId);
      } else {
        setCurrentSurahId(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Update URL when surah changes
  const handleSelectSurah = (surahId: number) => {
    window.location.hash = `#/surah/${surahId}`;
  };

  const handleBack = () => {
    window.location.hash = "#/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[400px] bg-white h-screen shadow-2xl relative overflow-hidden">
        {currentSurahId === null ? (
          <Home onSelectSurah={handleSelectSurah} />
        ) : (
          <SurahDetailView surahId={currentSurahId} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
