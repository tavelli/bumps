import React, {FunctionComponent} from "react";
import {RiderResult} from "../lib/bumps/model";
import {eventStats, eventElevationMap} from "../lib/bumps/const";

type Props = {
  results: RiderResult[];
};

export const RiderStatsLifetime: FunctionComponent<Props> = ({results}) => {
  const uniqueYearsCount = new Set(results.map((item) => item.year)).size;

  const totalHeight = results.reduce((sum, event) => {
    const height = eventElevationMap.get(event.event_slug) || 0; // Use 0 if ID not found
    return sum + height;
  }, 0);

  return (
    <div>
      <div className="flex gap-12 items-center">
        <div className="inline-flex flex-col gap-2 ">
          <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
            Years
            <br />
            participated
          </p>
          <p className="text-3xl font-bold font-mono text-white">
            {uniqueYearsCount}
          </p>
        </div>
        <div className="inline-flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
            Total
            <br />
            events
          </p>
          <p className="text-3xl font-bold font-mono text-white">
            {results.length}
          </p>
        </div>
        <div className="inline-flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-gray-300 font-semibold">
            Total
            <br />
            climbing
          </p>
          <p className="text-3xl font-bold font-mono text-white">
            {totalHeight.toLocaleString("en-US")} ft
          </p>
        </div>
      </div>
    </div>
  );
};
