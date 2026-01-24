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
    <div className="flex gap-4 mb-8 bg-slate-100 p-4 rounded-lg">
      <select
        value={searchParams?.get("year") || "2025"}
        onChange={(e) => updateFilter("year", e.target.value)}
        className="p-2 border rounded"
      >
        {years.map((y: string) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={searchParams?.get("category") || "Overall Men"}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="p-2 border rounded"
      >
        {categories.map((c: string) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
