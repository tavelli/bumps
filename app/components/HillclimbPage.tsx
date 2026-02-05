import React, {FunctionComponent} from "react";
import Image from "next/image";

import {format, parseISO} from "date-fns";
import Link from "next/link";
import {HillclimbEvent} from "@/app/lib/bumps/model";
import Markdown from "marked-react";

type Props = {
  event: HillclimbEvent;
  showLink?: boolean;
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

export const HillclimbPage: FunctionComponent<Props> = ({
  event,
  showLink = false,
}) => (
  <div className="">
    <p className="text-2xl lg:text-3xl text-center mt-10">
      {format(parseISO(event.date), "PP")} <span className="pl-2 pr-2">•</span>{" "}
      {event.location}
    </p>
    <div className={`text-center mt-8 mb-10`}>
      {event.registration && !event.note ? (
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
    <div className={`text-center mt-8 mb-10 text-2xl p-4 event-blurb`}>
      <Markdown value={event.blurb} openLinksInNewTab={true} />
    </div>
    <div className="mb-4 md:mb-6">
      <div className="relative">
        <div
          className="absolute hill-category "
          style={{top: "8px", right: "8px"}}
        >
          <span>{event.category}</span>
        </div>
        <HillPhoto event={event} />
        <div className="absolute" style={{left: "10px", bottom: "5px"}}>
          <div className={`text-2xl md:text-3xl lg:p-4 `}>
            <span className="font-bold">{event.distance}</span> mi{" "}
            <span className="pl-2 pr-2">•</span>{" "}
            <span className="font-bold">
              {event.elevationGain.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            ft <span className="pl-2 pr-2">•</span>{" "}
            <span className="font-bold">{event.gradient}</span> %
          </div>
        </div>
        <div className="absolute lg:p-4 " style={{right: "0", bottom: "5px"}}>
          <div className="w-1/2 md:w-3/4 ml-auto">
            <Image
              src={event.gradientProfile.url}
              alt={`gradient profile for ${event.title}`}
              width={136}
              height={56}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
