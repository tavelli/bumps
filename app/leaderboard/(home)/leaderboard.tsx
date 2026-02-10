"use client";

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {PodiumRider} from "@/app/lib/bumps/model";
import {CategoryPodium} from "@/app/components/CategoryPodium";
import {latestYear} from "@/app/lib/bumps/const";
import {SeasonGridSelector} from "@/app/components/SeasonSelect";

export function LeaderboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [podium, setPodium] = useState<{results?: PodiumRider[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedYear = searchParams.get("year") || latestYear;

  // Your Logic: Data Grouping
  const groupedData = podium?.results
    ? podium.results.reduce<Record<string, PodiumRider[]>>((acc, rider) => {
        const category = rider.category_display;
        if (!acc[category]) acc[category] = [];
        acc[category].push(rider);
        return acc;
      }, {})
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
  const overallPodiums = entries.slice(0, 2);
  const ageGroupPodiums = entries.slice(2);

  const updateYear = (year: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("year", year);
    router.push(`?${params.toString()}`, {scroll: false});
  };

  // Your Logic: API Fetching
  useEffect(() => {
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
            if (catA.includes("Overall") && !catB.includes("Overall"))
              return -1;
            if (!catA.includes("Overall") && catB.includes("Overall")) return 1;
            if (catA.includes("Under 20") && !catB.includes("Under 20"))
              return -1;
            if (!catA.includes("Under 20") && catB.includes("Under 20"))
              return 1;
            return catA.localeCompare(catB);
          }),
        });
      })
      .catch(async (err) => {
        if (cancelled) return;
        setError("failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedYear]);

  return (
    <section className="text-white">
      <div className="mt-4 mb-4 lg:mt-8 lg:mb-8">
        <SeasonGridSelector currentYear={selectedYear} onChange={updateYear} />
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
                  year={selectedYear}
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
                year={selectedYear}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
