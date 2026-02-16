import React, {FunctionComponent} from "react";
import Image from "next/image";

import {format, parseISO} from "date-fns";
import Link from "next/link";
import {HillclimbEvent} from "@/app/lib/bumps/model";

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

export const HillclimbLink: FunctionComponent<Props> = ({event}) => (
  <div className="mb-4 md:mb-6 hill-event">
    <div className="hill-header pb-2">
      <h3 className={`hill-title pt-2 pb-1`}>
        <Link
          href={`/event/${event.slug}`}
          className="underline"
          prefetch={false}
        >
          {event.title}
        </Link>
      </h3>
      <p className="hill-date  text-lg">
        {event.note === "Date TBD"
          ? "Date TBD"
          : format(parseISO(event.date), "PP")}{" "}
        <span className="pl-2 pr-2">•</span> {event.location}
      </p>
    </div>
    <Link href={`/event/${event.slug}`} className="underline" prefetch={false}>
      <div className="relative">
        <div
          className="absolute hill-category"
          style={{top: "8px", right: "8px"}}
        >
          <span>{event.category}</span>
        </div>
        <HillPhoto event={event} />
        <div className="absolute" style={{left: "10px", bottom: "5px"}}>
          <div className={`sm:text-lg font-bold`}>
            {event.distance} mi <span className="pl-2 pr-2">•</span>{" "}
            {event.elevationGain.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            ft <span className="pl-2 pr-2">•</span> {event.gradient}%
          </div>
        </div>
        <div className="absolute" style={{right: "0", bottom: "5px"}}>
          <Image
            src={event.gradientProfile.url}
            alt={`gradient profile for ${event.title}`}
            width={136}
            height={56}
          />
        </div>
      </div>
    </Link>
  </div>
);
