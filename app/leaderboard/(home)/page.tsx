// Try fetching from a dedicated riders table first
"use client";

import React, {useEffect, useMemo, useState} from "react";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {Footer} from "@/app/components/Footer";
import {useRouter} from "next/navigation";
import {PodiumRider} from "@/app/lib/bumps/model";
import {CategoryPodium} from "@/app/components/CategoryPodium";
import {years} from "@/app/lib/bumps/const";
import {SeasonGridSelector} from "@/app/components/SeasonSelect";

interface Props {
  params: {year: string};
}

export default function LeadersPage({params}: Props) {
  const router = useRouter();
  const [podium, setPodium] = useState<{
    results?: PodiumRider[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const groupedData = podium?.results
    ? podium.results.reduce<Record<string, PodiumRider[]>>((acc, rider) => {
        const category = rider.category_display;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(rider);
        return acc;
      }, {}) // The initial value {} is now typed by the generic above
    : {};

  const entries = Object.entries(groupedData);

  {
    /* 2. Slice the array */
  }
  const overallPodiums = entries.slice(0, 2); // The first two (Overall Men/Women)
  const ageGroupPodiums = entries.slice(2); // Everything else

  // navigate to year route with nextjs
  const updateYear = (year: string) => {
    setSelectedYear(year);
  };

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
    let cancelled = false;
    setLoading(true);
    fetch(`/api/podium/${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw res;
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPodium({
          results: data.results.sort((a: PodiumRider, b: PodiumRider) => {
            const catA = a.category_display;
            const catB = b.category_display;

            // 1. Handle "Overall" (Highest Priority)
            if (catA.includes("Overall") && !catB.includes("Overall"))
              return -1;
            if (!catA.includes("Overall") && catB.includes("Overall")) return 1;

            // 2. Handle "Under 20" (Second Priority)
            if (catA.includes("Under 20") && !catB.includes("Under 20"))
              return -1;
            if (!catA.includes("Under 20") && catB.includes("Under 20"))
              return 1;

            // 3. Fallback to standard comparison for the rest (20-29, 30-39, etc.)
            return catA.localeCompare(catB);
          }),
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
  }, [selectedYear]);

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

      <main className="p-4 lg:p-0 lg:pt-8 max-w-5xl mx-auto">
        <section className="text-white">
          {selectedYear && (
            <div className="mt-4 mb-4 lg:mt-8 lg:mb-8">
              <SeasonGridSelector
                currentYear={selectedYear}
                onChange={updateYear}
              />
            </div>
          )}
          {/* <div className="flex flex-col gap-2 justify-center mb-8 align-items-center text-center">
            {selectedYear && (
              <div className="">
                <label
                  htmlFor="seasonDropdown"
                  className="text-sm uppercase font-semibold tracking-wide text-gray-300 block mb-2"
                >
                  Season
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => updateYear(e.target.value)}
                  className="jumbo-select"
                  id="seasonDropdown"
                >
                  {years.map((y: string) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div> */}

          {loading ? (
            <p className="px-6 mt-4">Loading...</p>
          ) : error ? (
            <div>
              <h2 className="section-heading">Error</h2>
              <p className="mt-2">{error}</p>
            </div>
          ) : podium?.results && podium.results.length > 0 ? (
            <div>
              <div className="p-4 lg:p-8 mb-4 lg:mb-8">
                <div className="podium-grid podium-grid--overall">
                  {overallPodiums.map(([category, riders]) => (
                    <CategoryPodium
                      key={category}
                      categoryName={category}
                      riders={riders}
                      abbreviated={false}
                    />
                  ))}
                </div>
              </div>
              <div className="podium-grid">
                {ageGroupPodiums.map(([category, riders]) => (
                  <CategoryPodium
                    key={category}
                    categoryName={category}
                    riders={riders}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="section-heading"> not found</h2>
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
