"use client";

import {useSearchParams} from "next/navigation";
import {Suspense, useState, useEffect} from "react";
import {uniteaSans} from "@/app/fonts";
import Filters from "@/app/components/Filters";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedYear = searchParams.get("year") || "2025";
  const selectedCat = searchParams.get("category") || "Overall Men";

  const years = ["2025", "2024", "2023"];
  const categories = [
    "Overall Men",
    "Overall Women",
    "40-49 Men",
    "40-49 Women",
  ];

  useEffect(() => {
    // Fetch leaderboard data
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/leaderboard?year=${selectedYear}&category=${encodeURIComponent(
            selectedCat
          )}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedYear, selectedCat]);

  return (
    <div className={uniteaSans.className}>
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">BUMPS Leaderboard</h1>

        <Filters years={years} categories={categories} />

        {loading ? (
          <div className="text-center py-8">Loading leaderboard...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-slate-200">
                <th className="py-2">Rank</th>
                <th className="py-2">Rider</th>
                <th className="py-2">Age</th>
                <th className="py-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {results?.map((r, i) => (
                <tr key={r.result_id} className="border-b hover:bg-slate-50">
                  <td className="py-2 text-slate-500">{i + 1}</td>
                  <td className="py-2 font-semibold">{r.rider_name}</td>
                  <td className="py-2">{r.age_at_race}</td>
                  <td className="py-2 text-right text-blue-700 font-mono">
                    {r.points.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
