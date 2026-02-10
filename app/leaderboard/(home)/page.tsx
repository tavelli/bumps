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
import {latestYear, years} from "@/app/lib/bumps/const";
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
    : {
        "Overall Men": [],
        "Overall Women": [],
        "Under 20 Men": [],
        "Under 20 Women": [],
        "20-29 Men": [],
        "20-29 Women": [],
        "30-39 Men": [],
        "30-39 Women": [],
        "40-49 Men": [],
        "40-49 Women": [],
        "50-59 Men": [],
        "50-59 Women": [],
        "60-69 Men": [],
        "60-69 Women": [],
        "70-74 Men": [],
        "70-74 Women": [],
        "75-79 Men": [],
        "80+ Men": [],
      };

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
          <div className="mt-4 mb-4 lg:mt-8 lg:mb-8">
            <SeasonGridSelector
              currentYear={selectedYear || latestYear}
              onChange={updateYear}
            />
          </div>

          {error ? (
            <div>
              <h2 className="section-heading">Error</h2>
              <p className="mt-2">{error}</p>
            </div>
          ) : (
            <div>
              <div className="p-4 lg:p-8 mb-4 lg:mb-8">
                <div className="podium-grid podium-grid--overall">
                  {overallPodiums.map(([category, riders]) => (
                    <CategoryPodium
                      key={category}
                      categoryName={category}
                      riders={riders}
                      abbreviated={false}
                      isLoading={loading}
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
                    isLoading={loading}
                  />
                ))}
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
