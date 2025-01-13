import React, {FunctionComponent} from "react";
import Image from "next/image";

import {format, parseISO} from "date-fns";

export interface HillclimbEvent {
  title: string;
  date: string;
  registration: string;
  results: string;
  note: string;
  coverPhoto: {
    url: string;
  };
}

type Props = {
  event: HillclimbEvent;
};

export const Hillclimb: FunctionComponent<Props> = ({event}) => (
  <div className="relative hill-wrapper mb-4 md:mb-6">
    <div className="hill-photo">
      <Image
        src={event.coverPhoto.url}
        className=""
        alt={event.title}
        fill={true}
        sizes="(max-width: 768px) 100vw,
              (max-width: 1440px) 1440px"
      />
    </div>
    <div className="hill-header top-1 md:top-4 lg:top-6">
      <h3 className="hill-title">{event.title}</h3>
      <p className="hill-date">{format(parseISO(event.date), "PP")}</p>
      <div className="hill-buttons mt-2 md:mt-4 lg:mt-8">
        {event.results ? (
          <a
            target="_blank"
            rel="noopener"
            className="results"
            href={event.results}
          >
            Results
          </a>
        ) : event.registration && !event.note ? (
          <a target="_blank" rel="noopener" href={event.registration}>
            Register
          </a>
        ) : (
          <span className="pending">{event.note}</span>
        )}
      </div>
    </div>
  </div>
);
