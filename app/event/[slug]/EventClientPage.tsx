// app/events/[slug]/EventClientPage.tsx
"use client";

import React, {Suspense, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {Footer} from "@/app/components/Footer";
import {categories} from "@/app/lib/bumps/const";
import Filters from "@/app/components/Filters";
import {HillclimbPage} from "@/app/components/HillclimbPage";
import {RiderRank} from "@/app/components/RiderRank";
import {Racetime} from "@/app/components/RaceTIme";
import {EventCourseRecords} from "@/app/components/CourseRecords";
import {LegendCard} from "@/app/components/LegendCard";
import {getOnlyTopLegends} from "@/app/lib/bumps/utils";
import {HillclimbEvent, CourseRecords, RaceData} from "@/app/lib/bumps/model";
import EventResults from "./EventResults";

interface ClientProps {
  slug: string;
  initialDatoData: HillclimbEvent;
}

export default function EventClientPage({slug, initialDatoData}: ClientProps) {
  // State
  const [pageLoading, setPageLoading] = useState(true);
  const [event, setEvent] = useState<any | null>(null);
  const [records, setRecords] = useState<CourseRecords | null>(null);
  const [legends, setLegends] = useState<any | null>(null);

  // Logic: Fetch Event Metadata & Legends
  useEffect(() => {
    setPageLoading(true);
    fetch(`/api/event/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent({
          name: data.races[0]?.event_name || "",
          races: data?.races || [],
        });
        setRecords(data.records);
        setLegends({
          appearances: getOnlyTopLegends(
            data?.legends?.appearances || [],
            "appearance_count",
          ),
          points: getOnlyTopLegends(
            data?.legends?.points || [],
            "total_event_points",
          ),
          wins: getOnlyTopLegends(data?.legends?.wins || [], "overall_wins"),
          oldest: getOnlyTopLegends(
            data?.legends?.oldest || [],
            "max_age_attained",
          ),
        });
      })
      .finally(() => setPageLoading(false));
  }, [slug]);

  return (
    <div className={uniteaSans.className}>
      <header
        style={{
          backgroundImage: `url(${leaderboardBanner.src})`,
          backgroundSize: "cover",
        }}
        className="page-header flex flex-col"
      >
        <Navigation inverse={true} showLogo={true} />
        <h1 className="h1-heading h1-heading--big text-center">
          {initialDatoData.title}
        </h1>
        <p className="text-gray-800 text-lg uppercase tracking-widest text-center mt-2">
          {initialDatoData.state}
        </p>
      </header>

      <main className="max-w-5xl mx-auto">
        <HillclimbPage event={initialDatoData} />

        {records && (
          <div className="px-4 lg:px-0">
            <h2 className="subcategory-heading mt-16 mb-6" id="records">
              Course Records
            </h2>
            <EventCourseRecords records={records} />
          </div>
        )}

        <h2
          className="subcategory-heading mt-16 ml-4 lg:ml-0 mb-6"
          id="legends"
        >
          Hill Legends
        </h2>
        <div className="ml-4 mr-4 lg:ml-0 lg:mr-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <LegendCard
              title="Most Appearances"
              stat={
                (legends?.appearances &&
                  legends.appearances[0]?.appearance_count) ||
                0
              }
              statLabel="x"
              riders={legends?.appearances || []}
              icon="appearances"
            />
            <LegendCard
              title="Most Points"
              stat={
                (legends?.points && legends.points[0]?.total_event_points) || 0
              }
              statLabel="pts"
              riders={legends?.points || []}
              icon="points"
            />
            <LegendCard
              title="Most Wins"
              stat={(legends?.wins && legends.wins[0]?.overall_wins) || 0}
              statLabel="x"
              riders={legends?.wins || []}
              icon="wins"
            />
            <LegendCard
              title="Oldest Competitor"
              stat={
                (legends?.oldest && legends.oldest[0]?.max_age_attained) || 0
              }
              statLabel="yrs"
              icon="age"
              riders={legends?.oldest || []}
            />
          </div>
        </div>

        <h2 className="subcategory-heading mt-16 ml-4 lg:ml-0" id="results">
          Results
        </h2>
        <Suspense
          fallback={<div className="p-10 text-center">Loading Results...</div>}
        >
          <EventResults slug={slug} races={event?.races || []} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
