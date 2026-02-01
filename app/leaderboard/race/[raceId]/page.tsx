// Try fetching from a dedicated riders table first
"use client";

import React, {useEffect, useMemo, useState} from "react";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {getRacesCountForYear} from "@/app/lib/bumps/utils"; // Adjust path as needed
import {Footer} from "@/app/components/Footer";
import {categories, years} from "@/app/lib/bumps/const";

import {useSearchParams} from "next/navigation";
import Filters from "@/app/components/Filters";
import Link from "next/link";
import {format} from "date-fns";

interface Props {
  params: {raceId: string};
}

export default function RaceResultPage({params}: Props) {
  const searchParams = useSearchParams();
  const [resolvedRaceId, setResolvedRaceId] = useState<string | null>(null);
  const [race, setRace] = useState<{
    name: string;
    date: string;
  } | null>(null);

  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedYear = searchParams.get("year") || "2025";
  const selectedCat = searchParams.get("category") || "Overall Men";

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCat]);

  // Resolve params which may be a Promise in some Next.js runtimes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await (params as any);
        if (!cancelled) setResolvedRaceId(p?.raceId ?? null);
      } catch {
        if (!cancelled) setResolvedRaceId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!resolvedRaceId) return;
    let cancelled = false;
    setLoading(true);

    fetch(
      `/api/race/${resolvedRaceId}?year=${selectedYear}&category=${encodeURIComponent(
        selectedCat,
      )}&page=${currentPage}`,
    )
      .then((res) => {
        console.log(res);
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results);
        setTotalCount(data.count);
        setRace({
          name: data.results[0]?.event_name || "",
          date: data.results[0]?.race_date
            ? format(new Date(data.results[0]?.race_date), "MM/dd/yyyy")
            : "",
        });
      })
      .catch(async (err) => {
        if (cancelled) return;
        try {
          if (err instanceof Response) {
            const body = await err.json().catch(() => ({}));
            setError(body?.error || "failed");
          } else {
            setError("failed");
          }
        } catch {
          setError("failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedYear, selectedCat, currentPage, resolvedRaceId]);

  useEffect(() => {
    document.title =
      `${race?.name} ${race?.date ? new Date(race.date).getFullYear() : ""} - BUMPS Results` ||
      "Race Results";
  }, [race]);

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
        <h1 className="h1-heading text-center">{race && race.name}</h1>

        <p className="text-gray-600 font-medium  uppercase tracking-widest text-center mt-2 text-md lg:text-xl">
          {race?.date}
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="mt-8 ml-4 lg:ml-0">
          <Filters years={[]} categories={categories} />
        </div>
        {loading ? (
          <div>Loading...</div>
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
                </tr>
              </thead>
              <tbody>
                {results?.map((r, i) => (
                  <tr
                    key={r.rider_id + "-selectedCat"}
                    className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-base font-semibold">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    <td className="py-4 px-6 font-mono text-base">
                      {r.points}
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
                      {selectedYear
                        ? parseInt(selectedYear) - parseInt(r.birth_year)
                        : "--"}
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
