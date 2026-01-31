// Try fetching from a dedicated riders table first
"use client";

import React, {useEffect, useMemo, useState} from "react";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {getRacesCountForYear} from "@/app/lib/bumps/utils"; // Adjust path as needed

interface Props {
  params: {riderId: string};
}

export default function RiderProfilePage({params}: Props) {
  const [resolvedRiderId, setResolvedRiderId] = useState<string | null>(null);
  const [rider, setRider] = useState<{
    name: string;
    age?: number | null;
    results: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Resolve params which may be a Promise in some Next.js runtimes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await (params as any);
        if (!cancelled) setResolvedRiderId(p?.riderId ?? null);
      } catch {
        if (!cancelled) setResolvedRiderId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!resolvedRiderId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/rider/${resolvedRiderId}`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRider({
          name: data.name,
          age: data.age ?? null,
          results: data.results,
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
  }, [resolvedRiderId]);

  useEffect(() => {
    // set selected year to first available year when rider data loads
    if (rider?.results && rider.results.length > 0) {
      const years = Array.from(new Set(rider.results.map((r) => r.year))).sort(
        (a: any, b: any) => b - a,
      );
      setSelectedYear(String(years[0]));
    }
  }, [rider]);

  const {availableYears, filteredResults, earliestYear, seasonTotal} =
    useMemo(() => {
      if (!rider?.results || rider.results.length === 0) {
        return {
          availableYears: [],
          filteredResults: [],
          earliestYear: null,
          seasonTotal: 0,
        };
      }

      const yearNumbers = rider.results.map((r) => Number(r.year));

      // Get unique years and sort them descending for the dropdown
      const years = Array.from(new Set(yearNumbers))
        .sort((a, b) => b - a)
        .map(String);

      // Find the minimum year for the "Since" text
      const earliest = Math.min(...yearNumbers);

      // Filter results for the current year
      const resultsForYear = rider.results.filter(
        (r) => String(r.year) === selectedYear,
      );

      // Get the max count for this year
      const maxCount = getRacesCountForYear(Number(selectedYear));

      // Sort by points descending to determine which ones count toward the total
      const sortedByPoints = [...resultsForYear].sort(
        (a, b) => b.points - a.points,
      );

      const scoringIds = new Set(
        sortedByPoints.slice(0, maxCount).map((r) => r.race_id), // Assuming each result has a unique 'id'
      );

      // Calculate total based only on the top 'maxCount' results
      const total = sortedByPoints
        .slice(0, maxCount)
        .reduce((sum, r) => sum + (r.points || 0), 0);

      const filtered = resultsForYear.map((r) => {
        return {...r, countsTowardTotal: scoringIds.has(r.race_id)};
      });

      return {
        availableYears: years,
        filteredResults: filtered,
        earliestYear: earliest,
        seasonTotal: total,
      };
    }, [rider, selectedYear]);

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
        <h1 className="h1-heading text-center">{rider && rider.name}</h1>
        {earliestYear && (
          <p className="text-gray-600 font-medium  uppercase tracking-widest text-center mt-2 text-xl">
            Since {earliestYear}
          </p>
        )}
      </header>

      <main className="p-8 max-w-4xl mx-auto">
        <section className="text-white">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div>
              <h2 className="section-heading">Error</h2>
              <p className="mt-2">{error}</p>
            </div>
          ) : rider ? (
            <div>
              <div className="flex flex-col lg:flex-row gap-8 mt-4 justify-between">
                <div className="inline-flex flex-col gap-2 ">
                  <label
                    htmlFor="year-filter"
                    className="text-xs uppercase tracking-widest text-gray-300 font-semibold"
                  >
                    Season
                  </label>
                  <select
                    id="year-filter"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="inline-flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
                      Season Total
                    </p>
                    <p className="text-3xl font-bold font-mono text-white">
                      {seasonTotal}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-white rounded-lg overflow-hidden mt-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-4 px-6 text-left text-sm uppercase tracking-wide font-normal">
                        Event
                      </th>
                      <th
                        className="py-4 px-6 text-center text-sm uppercase tracking-wide font-normal"
                        style={{width: "80px"}}
                      >
                        Points
                      </th>
                      <th
                        className="hidden lg:table-cell  py-4 px-6 text-center text-sm uppercase tracking-wide font-normal"
                        style={{width: "175px"}}
                      >
                        Overall
                      </th>
                      <th
                        className="hidden lg:table-cell py-4 px-6 text-center text-sm uppercase tracking-wide font-normal"
                        style={{width: "175px"}}
                      >
                        Age Group
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults?.map((r, i) => (
                      <tr
                        key={r.event_name + r.year}
                        className={`border-b border-gray-800 hover:bg-gray-900 transition-colors ${
                          !r.countsTowardTotal ? "opacity-60" : "opacity-100"
                        }`}
                      >
                        <td className="py-4 px-6 font-bold text-lg">
                          {r.event_name}
                          {!r.countsTowardTotal && (
                            <span className="text-sm block uppercase tracking-tighter  font-normal">
                              Dropped Score
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-center font-mono text-lg font-semibold">
                          {r.points}
                        </td>
                        <td className="hidden lg:table-cell py-4 px-6 text-center  font-mono text-base">
                          <span className="font-semibold text-lg">
                            {r.overall_rank}{" "}
                          </span>
                          <span className="text-gray-300">
                            / {r.overall_total}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell py-4 px-6 text-center text-gray-300 font-mono text-base">
                          <span className="font-semibold text-lg">
                            {r.category_rank}{" "}
                          </span>
                          <span className="text-gray-300">
                            / {r.category_total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="section-heading">Rider not found</h2>
              <p className="mt-2">No rider found for ID {resolvedRiderId}.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
