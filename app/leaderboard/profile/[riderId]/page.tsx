// Try fetching from a dedicated riders table first
"use client";

import React, {useEffect, useMemo, useState} from "react";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {formatRaceTime, getRacesCountForYear} from "@/app/lib/bumps/utils"; // Adjust path as needed
import {Footer} from "@/app/components/Footer";
import Link from "next/link";
import {Racetime} from "@/app/components/RaceTIme";
import {RiderStatsLifetime} from "@/app/components/RiderLifetimeStats";
import {PrStats, RiderResult} from "@/app/lib/bumps/model";
import PrBadge from "../../../../public/pr-badge.svg";
import Image from "next/image";
import BadgeList from "@/app/components/ProfileBadges";
import {badgeList} from "@/app/lib/bumps/const";
import {ProfileCR} from "@/app/components/ProfileCourseRecord";
import {LoadingText} from "@/app/components/LoadingText";
interface Props {
  params: {riderId: string};
}

const SkeletonResultRow = () => (
  <tr className="border-b border-gray-800 animate-pulse">
    {/* Event Name & Mobile Stats Column */}
    <td className="py-4 px-6">
      <div className="h-6 w-48 bg-gray-800 rounded mb-2" />
      {/* Mobile-only pulses */}
      <div className="lg:hidden flex flex-col gap-4 mt-4">
        <div className="h-10 w-32 bg-gray-800 rounded" />
        <div className="flex gap-8">
          <div className="h-10 w-20 bg-gray-800 rounded" />
          <div className="h-10 w-20 bg-gray-800 rounded" />
        </div>
      </div>
    </td>
    {/* Time Column (Desktop) */}
    <td className="hidden lg:table-cell py-4 px-6">
      <div className="h-6 w-24 bg-gray-800 rounded" />
    </td>
    {/* Points Column */}
    <td className="py-4 px-6 text-center">
      <div className="h-6 w-12 bg-gray-800 rounded mx-auto" />
    </td>
    {/* Overall Rank (Desktop) */}
    <td className="hidden lg:table-cell py-4 px-6 text-center">
      <div className="h-6 w-20 bg-gray-800 rounded mx-auto" />
    </td>
    {/* Category Rank (Desktop) */}
    <td className="hidden lg:table-cell py-4 px-6 text-center">
      <div className="h-6 w-20 bg-gray-800 rounded mx-auto" />
    </td>
  </tr>
);

export default function RiderProfilePage({params}: Props) {
  const [resolvedRiderId, setResolvedRiderId] = useState<string | null>(null);
  const [rider, setRider] = useState<{
    name: string;
    age?: number | null;
    results?: RiderResult[];
    standings?: {
      year: any;
      overall_standing_rank: any;
      category_standing_rank: any;
      season_points: any;
      category_label: any;
    }[];
    courseRecords?: {
      out_event_name: string;
      out_event_slug: string;
      out_race_time: string;
      out_year: string;
    }[];
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
          standings: data.standings,
          courseRecords: data.courseRecords,
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

    document.title = `${rider?.name} - BUMPS Results` || "Race Results";
  }, [rider]);

  const {availableYears, filteredResults, earliestYear, seasonStandings} =
    useMemo(() => {
      if (!rider?.results || rider.results.length === 0) {
        return {
          availableYears: [],
          filteredResults: [],
          earliestYear: null,
        };
      }

      const eventPrs = (rider.results || []).reduce<Record<string, PrStats>>(
        (acc, entry) => {
          const slug = entry.event_slug;
          const time = entry.race_time;

          if (!acc[slug]) {
            acc[slug] = {
              event_slug: slug,
              fastest_time: time,
              entry_count: 1,
            };
          } else {
            acc[slug].entry_count++;

            // Ensure we handle potential null/undefined times if your data allows them
            if (time < acc[slug].fastest_time) {
              acc[slug].fastest_time = time;
            }
          }

          return acc;
        },
        {},
      );

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

      const filtered = resultsForYear.map((r) => {
        return {
          ...r,
          countsTowardTotal: scoringIds.has(r.race_id),
          isPr:
            // eventPrs[r.event_slug].entry_count > 1 &&
            r.race_time === eventPrs[r.event_slug].fastest_time,
        };
      });

      const standingsForYear = rider.standings?.find(
        (s) => String(s.year) === selectedYear,
      );

      return {
        availableYears: years,
        filteredResults: filtered,
        earliestYear: earliest,
        seasonStandings: standingsForYear,
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
        <div className="flex flex-col items-center">
          <h1 className="h1-heading text-center flex justify-center">
            <LoadingText
              isLoading={loading}
              placeholder="BUMPS RIDER"
              color="light"
            >
              {rider?.name}
            </LoadingText>
          </h1>

          <p className="text-gray-800 font-medium  uppercase tracking-widest text-center mt-2 text-md lg:text-xl">
            <LoadingText
              isLoading={loading}
              placeholder="Since 2012"
              color="light"
            >
              Since {earliestYear}
            </LoadingText>
          </p>
        </div>
      </header>

      <main className="lg:p-8 max-w-5xl mx-auto">
        <section className="text-white">
          {error ? (
            <div>
              <h2 className="section-heading">Rider not found</h2>
              <p className="mt-2">No rider found for ID {resolvedRiderId}.</p>
            </div>
          ) : (
            <div>
              <div className="ml-4 mr-4 lg:ml-0 lg:mr-0 lg:px-6 max-w-4xl">
                {rider?.courseRecords && rider.courseRecords.length > 0 && (
                  <>
                    <h2 className="subcategory-heading mt-16 " id="records">
                      Course Records
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                      {rider.courseRecords.map((r) => (
                        <ProfileCR
                          key={r.out_event_slug}
                          record={{
                            event_name: r.out_event_name,
                            event_slug: r.out_event_slug,
                            race_time: r.out_race_time,
                            year: r.out_year,
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                <h2 className="subcategory-heading mt-16 mb-4" id="results">
                  Lifetime Stats
                </h2>

                <RiderStatsLifetime
                  results={rider?.results || []}
                  isLoading={loading}
                />

                <div className="mt-4 md:mt-8">
                  <BadgeList
                    badges={badgeList}
                    results={rider?.results || []}
                    isLoading={loading}
                  />
                </div>

                <h2 className="subcategory-heading mt-16 " id="results">
                  Results
                </h2>

                <div className="flex flex-col lg:flex-row gap-8 mt-4 justify-between">
                  <div className="inline-flex flex-col gap-2 ">
                    <label
                      htmlFor="year-filter"
                      className="text-xs uppercase tracking-widest text-gray-300 font-semibold"
                    >
                      Season
                    </label>
                    {loading ? (
                      <div
                        style={{width: "84.5px", height: "42px"}}
                        className="bg-gray-700/50 animate-pulse rounded border border-gray-600 shadow-sm"
                      />
                    ) : (
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
                    )}
                  </div>

                  <div className="flex gap-8 items-center">
                    <div className="inline-flex flex-col gap-2 text-center">
                      <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
                        Points
                      </p>
                      <p className="text-3xl font-bold font-mono text-white">
                        <LoadingText isLoading={loading} placeholder="100">
                          {seasonStandings?.season_points ?? 0}
                        </LoadingText>
                      </p>
                    </div>
                    <div className="inline-flex flex-col gap-2 text-center">
                      <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
                        Overall
                      </p>
                      <p className="text-3xl font-bold font-mono text-white">
                        <LoadingText isLoading={loading} placeholder="100">
                          {seasonStandings?.overall_standing_rank || "--"}
                        </LoadingText>
                      </p>
                    </div>
                    <div className="inline-flex flex-col gap-2 text-center">
                      <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
                        {seasonStandings?.category_label || "Age Group"}
                      </p>

                      <p className="text-3xl font-bold font-mono text-white">
                        <LoadingText isLoading={loading} placeholder="100">
                          {seasonStandings?.category_standing_rank || "--"}
                        </LoadingText>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-white rounded-lg overflow-hidden mt-12">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-4 px-6 text-left text-sm uppercase tracking-wide font-normal">
                        Event
                      </th>
                      <th className="hidden lg:table-cell py-4 px-6 text-sm uppercase tracking-wide font-normal">
                        Time
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
                        {seasonStandings?.category_label || "Age Group"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? // Create an array of 4 items to map over
                        Array(4)
                          .fill(0)
                          .map((_, i) => <SkeletonResultRow key={i} />)
                      : filteredResults?.map((r, i) => (
                          <tr
                            key={r.event_name + r.year}
                            className={`border-b border-gray-800 hover:bg-gray-900 transition-colors ${
                              !r.countsTowardTotal
                                ? "opacity-60"
                                : "opacity-100"
                            }`}
                          >
                            <td className="py-4 px-6 font-bold text-lg">
                              <Link
                                href={`/event/${r.event_slug}`}
                                className="underline"
                              >
                                {" "}
                                {r.event_name}
                              </Link>
                              {!r.countsTowardTotal && (
                                <span className="text-sm block uppercase tracking-tighter  font-normal">
                                  Dropped Score
                                </span>
                              )}

                              <div className="py-4 lg:hidden  font-mono text-sm flex items-center flex-column">
                                <div>
                                  <div className="font-normal">Time</div>
                                  <div className="font-normal text-lg">
                                    <Racetime time={r.race_time} />
                                  </div>
                                </div>
                                {r.isPr && (
                                  <div className="inline ml-4">
                                    <Image
                                      src={PrBadge}
                                      alt="Personal record"
                                      width={24}
                                      height={24}
                                      priority
                                      style={{display: "inline"}}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="flex lg:hidden gap-8">
                                <div className=" py-4  font-mono text-sm">
                                  <div className="font-normal">Overall</div>
                                  <span className="font-semibold text-lg">
                                    {r.overall_rank}{" "}
                                  </span>
                                  <span className="text-gray-300">
                                    / {r.overall_total}
                                  </span>
                                </div>
                                <div className="py-4 font-mono text-sm">
                                  <div className="font-normal">
                                    {seasonStandings?.category_label ||
                                      "Age Group"}
                                  </div>
                                  <span className="font-semibold text-lg">
                                    {r.category_rank}{" "}
                                  </span>
                                  <span className="text-gray-300">
                                    / {r.category_total}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="hidden lg:table-cell py-4 px-6 font-mono text-base">
                              <Racetime time={r.race_time} />
                              {r.isPr && (
                                <div className="inline ml-4">
                                  <Image
                                    src={PrBadge}
                                    alt="Personal record"
                                    width={24}
                                    height={24}
                                    priority
                                    style={{display: "inline"}}
                                  />
                                </div>
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
          )}
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
