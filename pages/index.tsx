import {GetStaticProps, InferGetStaticPropsType} from "next";
import Image from "next/image";
import Head from "next/head";
import {uniteaSans} from "@/app/fonts";
import {request} from "../app/lib/datocms";
import bumpsLogoLetters from "../public/bumps-logo-letters.svg";
import cyclingHeroLogo from "../public/cycling-hero-white.svg";
import bumpsInfographic from "../public/infographic.svg";
import bumpsOldLogo from "../public/bumps-old-logo.png";
import bumpsJerseys from "../public/jserseys.png";

import {Hillclimb, HillclimbEvent} from "@/app/components/HillclimbEvent";

import {Navigation} from "@/app/components/Navigation";
import {useEffect, useState} from "react";

interface Champion {
  name: string;
  photoCredit: string;
}
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

const numberOfRaces = "four";

const cogburn: Champion = {
  name: "Cameron Cogburn",
  photoCredit: "Joe Viger Photography (JoeViger.com)",
};

const kristen: Champion = {
  name: "Kristen Kulchinsky",
  photoCredit: "Joe Viger Photography (JoeViger.com)",
};

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
  const [rando, setRando] = useState<number | null>(null);

  let champ: Champion;

  useEffect(() => {
    setRando(Math.round(Math.random()));
  }, []);

  if (rando === 0) {
    champ = cogburn;
  } else {
    champ = kristen;
  }

  return (
    <div className={uniteaSans.className}>
      <Head>
        <title>Bike Up the Mountain Point Series (BUMPS)</title>
        <meta
          name="description"
          content="A cycling hillclimb series featuring some of the most iconic climbs in the Northeast USA."
        />
      </Head>
      <header
        className={`bumps-main-header flex flex-col items-center pt-4 relative bumps-main-header-champ-${rando}`}
      >
        <div
          className="absolute"
          style={{top: "0px", left: "0px", width: "100%"}}
        >
          <Navigation />
        </div>
        <div
          style={{
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 className="section-heading italic bold pb-4 text-center">
            Bike Up the Mountain Points Series
          </h1>

          <Image
            src={bumpsLogoLetters}
            alt="Bike up Mountain Point Series Logo"
            width={250}
            priority
          />

          <div className="heading-splash">Hill Climb Series</div>

          <div className="pt-8 text-center">
            <div className="uppercase text-sm">presented by</div>
            <a href="https://cyclinghero.cc/" target="_blank" rel="noopener">
              <Image
                src={cyclingHeroLogo}
                alt="Cycling Hero"
                width={175}
                className="pt-2"
                priority
              />
            </a>
          </div>

          {/* <p className="pt-14" style={{maxWidth: "340px", textAlign: "center"}}>
            A yearlong competition featuring some of the most challenging and
            well-established cycling hill climb events in the Northeast United
            States.
          </p> */}
        </div>
        <div className="credits">
          <div className="photo-credit text-sm">{champ.photoCredit}</div>
          <div className="champion-credit text-sm">
            <span className="">2024 winner</span> {champ.name}
          </div>
        </div>
      </header>

      <main>
        <div className="content-wrapper">
          <section>
            <div className="grid md:grid-cols-3 mt-16 gap-5">
              <div className="col-span-2">
                <h2 className={`section-heading`} id="what">
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
              <div className="justify-self-center">
                <Image src={bumpsInfographic} alt="" width={250} />
              </div>
            </div>
          </section>

          <h2 id="events" className={`mt-16 section-heading`}>
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
          <section className="mt-16">
            <h2 className={`section-heading`} id="info">
              Info
            </h2>
            <div className="callout-heading pt-4">
              The scoring system prioritizes fast times, similar to a time
              trial, over your finishing position.
            </div>
            <p className="text-lg pt-2">
              We use a unique formula that takes into account your finishing
              time, the fastest time, and the average time to determine the
              number of points you will receive for each event. The fastest
              rider earns 100 points, and the average finish time earns 50
              points. If a rider finishes with a time that is twice the average
              time or slower, they will receive one point.
            </p>

            <p className="text-lg pt-2">
              Riders accumulate points in{" "}
              <strong style={{color: "#ffd333"}}>
                up to {numberOfRaces} races
              </strong>
              , and those entering more than {numberOfRaces} races are scored
              based on their best {numberOfRaces} results.
            </p>

            <div className="grid md:grid-cols-2 mt-8 gap-5">
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
                  the BUMPS scoring system, with the best <b>{numberOfRaces}</b>{" "}
                  race scores counting towards each rider&apos;s total.
                  Participation in any of the series events automatically
                  qualifies racers for the BUMPS series.
                </p>
              </div>
              <div>
                <h3 className="subcategory-heading">Categories</h3>

                <div>
                  <div className={`pt-2 `}>
                    <em>Male</em>
                  </div>
                  <div>
                    Overall, Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74,
                    75-79, 80+
                  </div>
                </div>

                <div>
                  <div className={`pt-2 `}>
                    <em>Female</em>
                  </div>
                  <div>
                    Overall, Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74,
                    75-79, 80+
                  </div>
                </div>

                <div className={`pt-2 `}>
                  <em>Overall unicycle</em>
                </div>

                <div className={`pt-2 `}>
                  <em>Overall tandem</em>
                </div>

                <p className="pt-4">
                  * Age categories are determined by a rider&apos;s age at the
                  end of the year. Please note that your age category for
                  individual races may differ from that of the BUMPS series.
                </p>
              </div>
            </div>
          </section>
          <section id="results" className="mt-16">
            <div className="grid md:grid-cols-2 mt-8 gap-5">
              <div>
                <h3 className="subcategory-heading">Sponsors</h3>
                <p className="pt-2 pb-2">
                  Interested in sponsoring the BUMPS series? Drop us a line at{" "}
                  <a
                    className="body-link"
                    href="mailto:info@bumpshillclimb.com"
                  >
                    info@bumpshillclimb.com
                  </a>
                  !
                </p>
              </div>
              <div>
                <Image src={bumpsJerseys} alt="Leader Jerseys" width={300} />
              </div>
            </div>
          </section>
          <section>
            <div
              className="flex flex-col justify-center items-center text-center"
              style={{marginTop: "10rem"}}
            >
              <div>
                <Image
                  src={bumpsOldLogo}
                  alt="Old Bumps logo"
                  width={150}
                  className="pb-2"
                />
              </div>
              <div className="uppercase">since 2013</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
