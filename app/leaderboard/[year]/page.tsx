"use client";

import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {Suspense, useState, useEffect} from "react";
import {uniteaSans} from "@/app/fonts";
import Filters from "@/app/components/Filters";
import leaderboardBanner from "@/public/leaderboard_banner.svg";

import {Navigation} from "../../components/Navigation";

import {Footer} from "../../components/Footer";
import {categories, years} from "@/app/lib/bumps/const";
import {RiderRank} from "@/app/components/RiderRank";

const TableLoading = () => {
  return (
    <div className="animate-pulse p-4">
      {/* Table Placeholder */}
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center border-b pb-4">
            <div className="h-8 w-8 bg-slate-100 rounded"></div>
            <div className="h-8 w-full bg-slate-100 rounded"></div>
            <div className="h-8 w-12 bg-slate-100 rounded"></div>
            <div className="h-8 w-16 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
interface Props {
  params: {year: string};
}

export default function LeaderboardContent({params}: Props) {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const selectedCat = searchParams.get("category") || "Overall Men";

  // Resolve params which may be a Promise in some Next.js runtimes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await (params as any);
        if (!cancelled) setSelectedYear(p?.year ?? years[0]);
      } catch (err) {
        if (!cancelled) setSelectedYear(years[0]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!selectedYear) return;
    setCurrentPage(1);
  }, [selectedYear, selectedCat]);

  useEffect(() => {
    if (!selectedYear) return;

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
        <h1 className="h1-heading text-center">
          {selectedYear || ""} Leaderboard
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {selectedYear && (
          <div className="mt-8 ml-4 lg:ml-0">
            <Filters
              years={years}
              categories={categories}
              currentYear={selectedYear}
              isLeaderboard={true}
            />
          </div>
        )}
        {loading ? (
          <TableLoading />
        ) : (
          <div className="text-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="py-4 px-6 text-left text-sm uppercase tracking-wide"
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
                    key={r.rider_id + "-" + selectedCat}
                    className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-base font-bold text-center">
                      <RiderRank
                        rank={
                          selectedCat.includes("Overall")
                            ? r.overall_standing_rank
                            : r.category_standing_rank
                        }
                      />
                    </td>
                    <td className="py-4 px-6 font-mono text-base">
                      {r.season_points}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <Link
                        href={`/leaderboard/profile/${r.rider_id}`}
                        className="underline"
                        prefetch={false}
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
