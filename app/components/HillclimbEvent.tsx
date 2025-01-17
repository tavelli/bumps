import React, {FunctionComponent} from "react";
import Image from "next/image";

import {format, parseISO} from "date-fns";

export interface HillclimbEvent {
  title: string;
  date: string;
  location: string;
  registration: string;
  results: string;
  note: string;
  category: string;
  gradient: number;
  distance: number;
  elevationGain: number;
  coverPhoto: {
    url: string;
  };
  aiCoverPhoto: {
    url: string;
  };
}

type Props = {
  event: HillclimbEvent;
};

export const Hillclimb: FunctionComponent<Props> = ({event}) => (
  <div className="mb-4 md:mb-6 hill-event">
    <div className="relative">
      <div className="absolute top-5 right-5 hill-category">
        <span>{event.category}</span>
      </div>
      <Image
        src={event.aiCoverPhoto.url}
        className="rounded-lg"
        alt={event.title}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }}
        width={400}
        height={200}
      />
    </div>
    <div className="hill-header pt-2">
      <div className={`font-bold text-lg `}>
        {event.distance} mi <span className="pl-2 pr-2">•</span>{" "}
        {event.elevationGain.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}{" "}
        ft <span className="pl-2 pr-2">•</span> {event.gradient}%
      </div>
      <h3 className={`hill-title text-3xl pt-2 pb-2`}>{event.title}</h3>
      <p className="hill-date  text-lg">
        {format(parseISO(event.date), "PP")}{" "}
        <span className="pl-2 pr-2">•</span> {event.location}
      </p>
      <div className={`pt-6`}>
        {event.results ? (
          <a
            target="_blank"
            rel="noopener"
            className="button-link"
            href={event.results}
          >
            Results
          </a>
        ) : event.registration && !event.note ? (
          <a
            target="_blank"
            rel="noopener"
            href={event.registration}
            className="button-link"
          >
            Register
          </a>
        ) : (
          <span className="disabled-link">{event.note}</span>
        )}
      </div>
    </div>
  </div>
);
