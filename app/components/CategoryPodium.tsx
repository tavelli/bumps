import {PodiumRider} from "../lib/bumps/model";
import React, {FunctionComponent} from "react";
import {RiderName} from "./RiderName";
import Link from "next/link";

type Props = {
  categoryName: string;
  riders?: PodiumRider[]; // Made optional for loading state
  abbreviated?: boolean;
  isLoading?: boolean; // Added loading prop
  year: string;
};

export const CategoryPodium: FunctionComponent<Props> = ({
  categoryName,
  riders = [],
  abbreviated = true,
  isLoading = false,
  year,
}: Props) => {
  return (
    <div className="border border-neutral-800 rounded-xl p-4 shadow-sm bg-black">
      {/* Header - Stays active as categoryName is available */}
      <div className="mb-4">
        <Link
          prefetch={false}
          href={`/leaderboard/${year}?category=${encodeURIComponent(categoryName)}`}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-500 transition-all group"
        >
          <span className="text-white font-bold text-base leading-tight">
            {categoryName.replace("Under 20", "U20")}
          </span>
          <span className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </Link>
      </div>

      <div className="space-y-2">
        {isLoading
          ? // Skeleton State: 3 rows
            Array(categoryName === "Overall Women" && year === "2025" ? 4 : 3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-1 px-1 animate-pulse"
                >
                  <div className="flex gap-3">
                    {/* Rank Circle Placeholder */}
                    <div className="w-6 h-6 bg-neutral-800 rounded-full" />
                    {/* Name Placeholder */}
                    <div className="h-7 w-32 bg-neutral-800 rounded py-1 px-1" />
                  </div>
                  {/* Points Placeholder */}
                  <div className="h-6 w-10 bg-neutral-800 rounded" />
                </div>
              ))
          : // Actual Data State
            riders.map((rider) => (
              <div
                key={rider.rider_name}
                className="flex justify-between items-center py-1 px-1"
              >
                <div className="flex gap-3">
                  <span className="text-xl">
                    {rider.rank === 1 ? "🥇" : rider.rank === 2 ? "🥈" : "🥉"}
                  </span>
                  <RiderName
                    name={rider.rider_name}
                    rider_id={rider.rider_id}
                    abbreviated={abbreviated}
                  />
                </div>
                <span className="font-mono text-neutral-300 font-medium">
                  {rider.season_points}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};
