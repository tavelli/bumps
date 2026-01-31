"use client";

import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {Suspense, useState, useEffect} from "react";
import {uniteaSans} from "@/app/fonts";
import Filters from "@/app/components/Filters";
import leaderboardBanner from "@/public/leaderboard_banner.svg";

import {Navigation} from "../components/Navigation";
import Loading from "./loading";
import {Footer} from "../components/Footer";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    "Under 20 Men",
    "20-29 Men",
    "30-39 Men",
    "40-49 Men",
    "50-59 Men",
    "60-69 Men",
    "70-79 Men",
    "80+ Men",
    "Under 20 Women",
    "20-29 Women",
    "30-39 Women",
    "40-49 Women",
    "50-59 Women",
    "60-69 Women",
    "70-79 Women",
    "80+ Women",
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCat]);

  useEffect(() => {
    // Fetch leaderboard data
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/leaderboard?year=${selectedYear}&category=${encodeURIComponent(
            selectedCat,
          )}&page=${currentPage}`,
        );
        const data = await response.json();
        setResults(data.results);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [selectedYear, selectedCat, currentPage]);

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

      <main className="max-w-4xl mx-auto">
        <div className="mt-8 ml-4 lg:ml-0">
          <Filters years={years} categories={categories} />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="text-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="py-4 px-6 text-left text-smuppercase tracking-wide"
                    style={{width: "80px"}}
                  >
                    Rank
                  </th>
                  <th
                    className="py-4 px-6 text-right text-sm uppercase tracking-wide"
                    style={{width: "80px"}}
                  >
                    Points
                  </th>
                  <th className="py-4 px-6 text-left text-sm uppercase tracking-wide">
                    Name
                  </th>
                  <th
                    className="hidden lg:table-cell py-4 px-6 text-left text-sm uppercase tracking-wide"
                    style={{width: "100px"}}
                  >
                    Age
                  </th>
                  <th
                    className="hidden lg:table-cell py-4 px-6 text-left text-sm uppercase tracking-wide"
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
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td className="py-4 px-6 font-mono text-base">
                      {r.season_points}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <Link
                        href={`/leaderboard/profile/${r.rider_id}`}
                        className="underline"
                      >
                        {r.rider_name}
                      </Link>
                    </td>
                    <td className="hidden lg:table-cell py-4 px-6 text-gray-300 font-mono text-base">
                      {r.age_at_race}
                    </td>
                    <td className="hidden lg:table-cell py-4 px-6 text-center text-gray-300 font-mono text-base">
                      {r.total_races}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-t border-gray-700">
              <div className="text-gray-400">
                <span className="text-white">
                  <span className="font-semibold ">{totalCount}</span>{" "}
                  <span className="text-sm">participants</span>
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-bold uppercase letter-spacing-1 border border-white disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-white disabled:hover:outline-none"
                >
                  &lt; Previous
                </button>
                {/* <span className="text-sm text-gray-400">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {Math.ceil(results.length / itemsPerPage) || 1}
                  </span>
                </span> */}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={results.length < itemsPerPage}
                  className="px-3 py-2 text-sm font-bold uppercase letter-spacing-1 border border-white disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-white disabled:hover:outline-none"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer>
        <Footer />
      </footer>
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
