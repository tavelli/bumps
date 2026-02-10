import React, {FunctionComponent, ReactNode} from "react";
import {RiderResult} from "../lib/bumps/model";
import {eventElevationMap, badgeList} from "../lib/bumps/const";
import {LoadingText} from "./LoadingText";

type Props = {
  results: RiderResult[] | undefined; // Allow undefined for loading state
  isLoading?: boolean;
};

// Internal Helper to avoid repeating the flex/text/skeleton logic
const Stat = ({
  label,
  value,
  isLoading,
  placeholder,
}: {
  label: ReactNode;
  value: ReactNode;
  placeholder?: string;
  isLoading?: boolean;
}) => (
  <div className="inline-flex flex-col gap-2 min-w-[100px]">
    <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold leading-tight">
      {label}
    </p>

    <p className="text-3xl font-bold font-mono text-white">
      <LoadingText
        isLoading={isLoading || false}
        placeholder={placeholder || "10"}
      >
        {value}
      </LoadingText>
    </p>
  </div>
);

export const RiderStatsLifetime: FunctionComponent<Props> = ({
  results = [],
  isLoading,
}) => {
  const uniqueYearsCount = new Set(results.map((item) => item.year)).size;

  const totalHeight = results.reduce((sum, event) => {
    const height = eventElevationMap.get(event.event_slug) || 0;
    return sum + height;
  }, 0);

  const eventsCompleted = badgeList.filter(
    (b) => !b.isLegacy && results.some((r) => r.event_slug === b.slug),
  ).length;

  const totalActiveEvents = badgeList.filter((b) => !b.isLegacy).length;

  return (
    <div>
      <div className="flex gap-8 flex-wrap items-center">
        <Stat
          label={
            <>
              Years
              <br />
              competed
            </>
          }
          value={uniqueYearsCount}
          isLoading={isLoading}
        />
        <Stat
          label={
            <>
              Races
              <br />
              entered
            </>
          }
          value={results.length}
          isLoading={isLoading}
        />
        <Stat
          label={
            <>
              Events
              <br />
              completed
            </>
          }
          value={
            <>
              {eventsCompleted}/
              <span className="text-gray-300">{totalActiveEvents}</span>
            </>
          }
          isLoading={isLoading}
        />
        <Stat
          label={
            <>
              Total
              <br />
              climbing
            </>
          }
          value={
            <>
              {totalHeight.toLocaleString("en-US")}
              <span className="text-xl opacity-80 ml-1">ft</span>
            </>
          }
          isLoading={isLoading}
          placeholder="5,000"
        />
      </div>
    </div>
  );
};
