// Try fetching from a dedicated riders table first
"use client";

import {request} from "@/app/lib/datocms";

import React, {useEffect, useMemo, useState} from "react";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {Footer} from "@/app/components/Footer";
import {categories, years} from "@/app/lib/bumps/const";

import {useSearchParams} from "next/navigation";
import Filters from "@/app/components/Filters";
import Link from "next/link";

import {HillclimbPage} from "@/app/components/HillclimbPage";
import {HillclimbEvent, CourseRecords} from "@/app/lib/bumps/model";
import {RiderRank} from "@/app/components/RiderRank";
import {Racetime} from "@/app/components/RaceTIme";
import {EventCourseRecords} from "@/app/components/CourseRecords";

const EVENT_QUERY = `query Events($slug: String) {
    event(filter: {slug: {eq: $slug}}) {
      date
      location
      state
      title
      blurb
      registration
      results
      note
      category
      gradient
      distance
      elevationGain
      gradientProfile {
        url
      }
      aiCoverPhotoAlt {
        url
      }
    }
}`;

interface EventQuery {
  event: HillclimbEvent;
}

interface Props {
  params: {slug: string};
}

async function getEventData(slug: string): Promise<EventQuery> {
  const data = await request({
    query: EVENT_QUERY,
    variables: {
      slug: slug,
    },
    includeDrafts: true,
    excludeInvalid: true,
  });
  return data;
}

export default function EventPage({params}: Props) {
  const searchParams = useSearchParams();
  const [resolvedEventSlug, setResolvedEventSlug] = useState<string | null>(
    null,
  );
  const [event, setEvent] = useState<{
    name: string;
    event_id: number;
    races: {
      event_id: number;
      race_date: string;
      race_id: number;
      race_year: number;
    }[];
  } | null>(null);

  const [records, setRecords] = useState<CourseRecords | null>(null);

  const [datoData, setDatoData] = useState<HillclimbEvent | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [raceLoading, setRaceLoading] = useState(false);

  const selectedYear = searchParams.get("year");
  const selectedCat = searchParams.get("category") || "Overall Men";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const raceYears = useMemo(() => {
    if (!event) return [];
    const yrs = event.races
      .map((r) => r.race_year.toString())
      .sort((a, b) => parseInt(b) - parseInt(a));
    return yrs;
  }, [event]);

  const raceYear = selectedYear ? selectedYear : raceYears[0];

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
        if (!cancelled) setResolvedEventSlug(p?.slug ?? null);
      } catch (err) {
        if (!cancelled) setResolvedEventSlug(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!resolvedEventSlug) return;
    let cancelled = false;
    setPageLoading(true);

    fetch(`/api/event/${resolvedEventSlug}`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        setEvent({
          name: data.races[0]?.event_name || "",
          event_id: data.races[0]?.event_id || 0,
          races: data?.races || [],
        });
        setRecords(data.records);
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
        if (!cancelled) setPageLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedEventSlug]);

  useEffect(() => {
    if (!resolvedEventSlug) return;

    getEventData(resolvedEventSlug)
      .then((data) => {
        setDatoData(data.event);
      })
      .catch((err) => {
        console.error("Error fetching event data:", err);
      });
  }, [resolvedEventSlug]);

  useEffect(() => {
    // find race id in event races by matching year
    const selectedRaceId =
      event?.races.find((r) => r.race_year.toString() === raceYear)?.race_id ||
      null;

    if (!selectedRaceId) return;

    let cancelled = false;
    setRaceLoading(true);
    fetch(
      `/api/race/${selectedRaceId}/?category=${encodeURIComponent(
        selectedCat,
      )}&page=${currentPage}`,
    )
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results);
        setTotalCount(data.count);
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
        if (!cancelled) setRaceLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedYear, selectedCat, currentPage, event?.races]);

  useEffect(() => {
    document.title =
      `${event?.name} - BUMPS Hill Climb Series` || "BUMPS Hill Climb Series";
  }, [event]);

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
        <h1 className="h1-heading h1-heading--big text-center">
          {event && event.name}
        </h1>

        <p className="text-gray-800 text-lg  uppercase tracking-widest text-center mt-2 text-md lg:text-xl">
          {datoData && datoData.state}
        </p>
      </header>

      <main className="max-w-5xl mx-auto">
        {datoData && <HillclimbPage event={datoData} />}

        {records && (
          <div className="ml-4 mr-4 lg:ml-0 lg:mr-0">
            <h2 className="subcategory-heading mt-16 mb-6" id="results">
              Course Records
            </h2>
            <EventCourseRecords records={records} />
          </div>
        )}

        <h2 className="subcategory-heading mt-16 ml-4 lg:ml-0" id="results">
          Results
        </h2>
        <div className="mt-8 ml-4 lg:ml-0">
          <Filters
            years={raceYears}
            categories={categories}
            isLeaderboard={false}
          />
        </div>
        {raceLoading ? (
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
                    className="py-4 px-6 text-sm uppercase tracking-wide"
                    style={{width: "100px"}}
                  >
                    Time
                  </th>
                  <th
                    className="hidden md:table-cell  py-4 px-6 text-right text-sm uppercase tracking-wide"
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
                      <RiderRank
                        rank={(currentPage - 1) * itemsPerPage + i + 1}
                      />
                    </td>
                    <td className="py-4 px-6 font-mono text-base">
                      <Racetime time={r.race_time} />

                      <div className="md:hidden mt-2">{r.points} pts</div>
                    </td>
                    <td className="hidden md:table-cell py-4 px-6 font-mono text-base">
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
                      {raceYear
                        ? parseInt(raceYear) - parseInt(r.birth_year)
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
