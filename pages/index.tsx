import {GetStaticProps, InferGetStaticPropsType} from "next";
import Image from "next/image";
import Head from "next/head";

import {request} from "../app/lib/datocms";
import bumpsLogoLetters from "../public/bumps-logo-letters.svg";
import cyclingHeroLogo from "../public/cycling-hero-white.svg";

import {Hillclimb, HillclimbEvent} from "@/app/components/HillclimbEvent";
import {uniteaSansBold} from "@/app/fonts";

interface HomepageQuery {
  allEvents: HillclimbEvent[];
}

const HOMEPAGE_QUERY = `query Events {
    allEvents {
      date
      location
      title
      registration
      results
      note
      category
      gradient
      distance
      elevationGain
      aiCoverPhoto {
        url
      }
      coverPhoto {
        url
      }
    }
}`;
export const getStaticProps: GetStaticProps<{data: HomepageQuery}> = async (
  context
) => {
  const data = await request({
    query: HOMEPAGE_QUERY,
    variables: {},
    includeDrafts: true,
    excludeInvalid: true,
  });
  return {
    props: {data},
  };
};

export default function Home({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={`justify-between  min-h-screen `}>
      <Head>
        <title>Bike Up the Mountain Point Series (BUMPS)</title>
        <meta
          name="description"
          content="A cycling hillclimb series featuring some of the most iconic climbs in the Northeast USA."
        />
      </Head>
      <header className="bumps-main-header flex flex-col items-center pt-4 ">
        <nav className="nav grid gap-4 md:grid-cols-4 pb-32 pt-2 justify-items-center">
          <a href="#what" className="">
            Overview
          </a>
          <a href="#events" className="">
            Points System
          </a>
          <a href="#info" className="">
            Prizes
          </a>
          <a
            target="_blank"
            rel="noopener"
            href="https://www.road-results.com/BUMPS"
            className=""
          >
            Results
          </a>
        </nav>

        <Image
          src={cyclingHeroLogo}
          alt="Cycling Hero"
          width={146}
          className="pb-4"
          priority
        />

        <Image
          src={bumpsLogoLetters}
          alt="Bike up Mountain Point Series Logo"
          width={250}
          className=""
          priority
        />
        <h1 className="sr-only">Bike Up the Mountain Points Series (BUMPS)</h1>
        <p className="uppercase text-lg pt-4">Hill Climb Series</p>
      </header>

      <main>
        <div className="content-wrapper">
          <section>
            <div className="grid grid-cols-3 mt-16 gap-5">
              <div className="col-span-2">
                <h2 className={`section-heading ${uniteaSansBold.className}`}>
                  What is BUMPS?
                </h2>
                <div className="callout-heading-sm pt-4">
                  BUMPS is a yearlong competition featuring some of the most
                  challenging and well-established cycling hill climb events in
                  the Northeast United States.
                </div>

                <p className="text-lg pt-2">
                  BUMPS aims to bring additional acknowledgment to riders who
                  enjoy the challenge of climbing.
                </p>
                <p className="text-lg pt-2">
                  Each event is run by an independent organizer. Event formats
                  and prizes are determined independently.
                </p>
              </div>
              <div></div>
            </div>
          </section>

          <h2
            id="events"
            className={`mt-16 section-heading ${uniteaSansBold.className}`}
          >
            Events
          </h2>
          <div className="callout-heading pt-4"></div>
          <p className="text-lg"> </p>
          <section className="hill-listing pt-2">
            {data.allEvents
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((event) => {
                return <Hillclimb key={event.title} event={event}></Hillclimb>;
              })}
          </section>
          <section id="info" className="mt-16">
            <h2 className={`section-heading ${uniteaSansBold.className}`}>
              Info
            </h2>
            <div className="callout-heading pt-4">
              The scoring system prioritizes fast times, similar to a time
              trial, over your finishing position.
            </div>
            <p className="">
              We use a unique formula that takes into account your finishing
              time, the fastest time, and the average time to determine the
              number of points you will receive for each event. The fastest
              rider earns 100 points, and the average finish time earns 50
              points. If a rider finishes with a time that is twice the average
              time or slower, they will receive one point.
            </p>

            <div className="grid grid-cols-2 mt-8 gap-5">
              <div>
                <h3 className="subcategory-heading">Points System</h3>
                <p className="pt-2 pb-2">
                  To calculate your points, use this equation:
                </p>
                <p className="bold pt-2 pb-2">
                  Points = 100 - 50 * [(Your Time - Fastest Time) / (Average
                  Time - Fastest Time)]
                </p>
                <p className="italic pt-2 pb-2">
                  Example: In a race where the fastest time is 1:00 and the
                  average finish time is 1:30: Finishing in 1:15 earns 75
                  points, 1:30 earns 50 points, 1:45 earns 25 points, and finish
                  times of 2:00 or slower earn one point.
                </p>
                <p className=" pt-2 pb-2">
                  Each event will utilize its own timing system to determine
                  category winners and distribute event-specific awards. The
                  results of each race will subsequently be incorporated into
                  the BUMPS scoring system, with the best <b>four</b> race
                  scores counting towards each rider&apos;s total. Participation
                  in any of the series events automatically qualifies racers for
                  the BUMPS series.
                </p>
              </div>
              <div>
                <h3 className="subcategory-heading">Sponsors</h3>
                <p className="pt-2 pb-2">
                  Interested in sponsoring the BUMPS series? Drop us a line at
                  info@bumpshillclimb.com!
                </p>
              </div>
            </div>
          </section>
          <section id="results" className="mt-16">
            <div className="grid grid-cols-2 mt-8 gap-5">
              <div>
                <h2 className={`section-heading ${uniteaSansBold.className}`}>
                  Results
                </h2>
                <div className="callout-heading-sm pt-4">
                  Participation in any of the series events automatically
                  qualifies racers for the BUMPS series.
                </div>
                <p className="text-lg pt-2">
                  Riders accumulate points in up to four races, and those
                  entering more than four races are scored based on their best
                  four results.
                </p>
                <div>
                  <div className={`pt-2 ${uniteaSansBold.className}`}>Male</div>
                  <div>
                    Overall, Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74,
                    75-79, 80+
                  </div>
                </div>

                <div>
                  <div className={`pt-2 ${uniteaSansBold.className}`}>
                    Female
                  </div>
                  <div>
                    Overall, Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74,
                    75-79, 80+
                  </div>
                </div>

                <div className={`pt-2 ${uniteaSansBold.className}`}>
                  Overall unicycle
                </div>

                <div className={`pt-2 ${uniteaSansBold.className}`}>
                  Overall tandem
                </div>

                <p className="pt-4">
                  * Age categories are determined by a rider&apos;s age at the
                  end of the year. Please note that your age category for
                  individual races may differ from that of the BUMPS series.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
