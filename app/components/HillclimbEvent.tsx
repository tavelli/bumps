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
  gradientProfile: {
    url: string;
  };
  aiCoverPhoto: {
    url: string;
  };
  aiCoverPhotoAlt: {
    url: string;
  };
}

type Props = {
  event: HillclimbEvent;
};

const HillPhoto: FunctionComponent<Props> = ({event}) => (
  <Image
    src={event.aiCoverPhotoAlt.url}
    className=""
    alt={event.title}
    sizes="100vw"
    style={{
      width: "100%",
      height: "auto",
    }}
    width={400}
    height={200}
  />
);

export const Hillclimb: FunctionComponent<Props> = ({event}) => (
  <div className="mb-4 md:mb-6 hill-event">
    <div className="relative">
      <div className="absolute top-3 right-3 hill-category">
        <span>{event.category}</span>
      </div>
      <HillPhoto event={event} />
      <div className="absolute" style={{left: "10px", bottom: "5px"}}>
        <div className={`text-lg font-bold`}>
          {event.distance} mi <span className="pl-2 pr-2">•</span>{" "}
          {event.elevationGain.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}{" "}
          ft <span className="pl-2 pr-2">•</span> {event.gradient}%
        </div>
      </div>
      <div className="absolute" style={{right: "5px", bottom: "5px"}}>
        <Image
          src={event.gradientProfile.url}
          alt={`gradient profile for ${event.title}`}
          width={134}
          height={56}
        />
      </div>
    </div>
    <div className="hill-header pt-2">
      <h3 className={`hill-title pt-2 pb-1`}>{event.title}</h3>
      <p className="hill-date  text-lg">
        {format(parseISO(event.date), "PP")}{" "}
        <span className="pl-2 pr-2">•</span> {event.location}
      </p>
      <div className={`pt-4`}>
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
