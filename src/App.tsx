import { useState } from "react";
import Home from "./components/Home";
import SurahDetailView from "./components/SurahDetailView";

export default function App() {
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[400px] bg-white h-screen shadow-2xl relative overflow-hidden">
        {currentSurahId === null ? (
          <Home onSelectSurah={setCurrentSurahId} />
        ) : (
          <SurahDetailView
            surahId={currentSurahId}
            onBack={() => setCurrentSurahId(null)}
          />
        )}
      </div>
    </div>
  );
}
