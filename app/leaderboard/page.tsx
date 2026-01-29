"use client";

import {useSearchParams} from "next/navigation";
import {Suspense, useState, useEffect} from "react";
import {uniteaSans} from "@/app/fonts";
import Filters from "@/app/components/Filters";
import leaderboardBanner from "@/public/leaderboard_banner.svg";

import {Navigation} from "../components/Navigation";
import Loading from "./loading";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedYear = searchParams.get("year") || "2025";
  const selectedCat = searchParams.get("category") || "Overall Men";

  const years = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2019",
    "2018",
    "2015",
    "2014",
    "2013",
  ];
  const categories = [
    "Overall Men",
    "Overall Women",
    "Under 20 Women",
    "20-29 Women",
    "30-39 Women",
    "40-49 Women",
    "50-59 Women",
    "60-69 Women",
    "70-79 Women",
    "80+ Women",
    "Under 20 Men",
    "20-29 Men",
    "30-39 Men",
    "40-49 Men",
    "50-59 Men",
    "60-69 Men",
    "70-79 Men",
    "80+ Men",
  ];

  useEffect(() => {
    // Fetch leaderboard data
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/leaderboard?year=${selectedYear}&category=${encodeURIComponent(
            selectedCat,
          )}`,
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
      <header
        style={{
          backgroundImage: `url(${leaderboardBanner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="page-header flex flex-col"
      >
        <Navigation inverse={true} showLogo={true} />
        <h1 className="h1-heading text-center">Leaderboard</h1>
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <Filters years={years} categories={categories} />
        {loading ? (
          <Loading />
        ) : (
          <div className="text-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide"
                    style={{width: "100px"}}
                  >
                    Rank
                  </th>
                  <th
                    className="py-4 px-6 text-right text-sm font-semibold uppercase tracking-wide"
                    style={{width: "100px"}}
                  >
                    Points
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide">
                    Name
                  </th>
                  <th
                    className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide"
                    style={{width: "100px"}}
                  >
                    Age
                  </th>
                  <th
                    className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wide"
                    style={{width: "175px"}}
                  >
                    Races Entered
                  </th>
                </tr>
              </thead>
              <tbody>
                {results?.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-base font-semibold">
                      {i + 1}
                    </td>
                    <td className="py-4 px-6 font-mono text-base">
                      {r.season_points}
                    </td>
                    <td className="py-4 px-6 font-semibold">{r.rider_name}</td>
                    <td className="py-4 px-6 text-gray-300 font-mono text-base">
                      {r.age_at_race}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-300 font-mono text-base">
                      {r.total_races}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
