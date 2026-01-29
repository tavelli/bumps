"use client";

import {useRouter, useSearchParams} from "next/navigation";

export default function Filters({
  years,
  categories,
}: {
  years: string[];
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-8 mb-8 flex-col">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="seasonDropdown"
            className="text-sm uppercase font-semibold tracking-wide text-gray-300"
          >
            Season
          </label>
          <select
            value={searchParams?.get("year") || "2025"}
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
