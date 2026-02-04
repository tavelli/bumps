"use client";

import {useRouter, useSearchParams} from "next/navigation";

export default function Filters({
  years,
  categories,
  currentYear,
  isLeaderboard = false,
}: {
  years: string[];
  categories: string[];
  currentYear?: string;
  isLeaderboard?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    if (isLeaderboard && key === "year") {
      updateYear(value);
    } else {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(key, value);
      router.push(`?${params.toString()}`, {scroll: false});
    }
  };

  const updateYear = (year: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    router.push(`/leaderboard/${year}/?${params.toString()}`);
  };

  return (
    <div className="flex gap-8 mb-8 flex-col">
      <div className="flex gap-4">
        {years.length > 1 && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="seasonDropdown"
              className="text-sm uppercase font-semibold tracking-wide text-gray-300"
            >
              Season
            </label>
            <select
              value={
                isLeaderboard
                  ? currentYear
                  : searchParams?.get("year") || years[0]
              }
              onChange={(e) => updateFilter("year", e.target.value)}
              className=""
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
        <div className="flex flex-col gap-2">
          <label
            htmlFor="categoryDropdown"
            className="text-sm uppercase font-semibold tracking-wide text-gray-300"
          >
            Category
          </label>
          <select
            value={searchParams?.get("category") || "Overall Men"}
            onChange={(e) => updateFilter("category", e.target.value)}
            className=""
            id="categoryDropdown"
          >
            {categories.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
