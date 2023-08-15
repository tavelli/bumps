import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Head from "next/head";

import { Righteous } from "next/font/google";

import { request } from "../app/lib/datocms";
import bumpsLogo from "../public/bumps-logo.png";
import cyclingHeroLogo from "../public/cycling-hero-orange.svg";

import { Hillclimb, HillclimbEvent } from "@/app/components/HillclimbEvent";

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
      coverPhoto {
        url
      }
    }
}`;
export const getStaticProps: GetStaticProps<{ data: HomepageQuery }> = async (
  context
) => {
  const data = await request({
    query: HOMEPAGE_QUERY,
    variables: {},
    includeDrafts: true,
    excludeInvalid: true,
  });
  return {
    props: { data },
  };
};

const righteous = Righteous({ weight: "400", subsets: ["latin"] });

export default function Home({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={`justify-between  min-h-screen ${righteous.className}`}>
      <Head>
        <title>Bike Up the Mountain Point Series (BUMPS)</title>
        <meta
          name="description"
          content="A cycling hillclimb series featuring some of the most iconic climbs in the Northeast USA."
        />
      </Head>
      <header className="flex flex-col items-center pt-4 pb-8 md:p-8 lg:p-10 ">
        <Image
          src={bumpsLogo}
          alt="Bike up Mountain Point Series Logo"
          width={250}
          className="pl-4 pr-4 md:pl-0 md:pr-0"
          priority
        />
        <h1 className="sr-only">Bike Up the Mountain Points Series (BUMPS)</h1>
        <p className="text-xl sr-only">
          A cycling hillclimb series featuring some of the most iconic climbs in
          the Northeast USA.
        </p>
      </header>
      <section className="flex flex-col items-center mt-4 pt-6 mb-2 pb-2  presented-by">
        <a target="_blank" rel="noopener" href="https://cyclinghero.cc/">
          <Image
            src={cyclingHeroLogo}
            alt="Cycling Hero"
            width={200}
            priority
          />
        </a>
        <h3 className="p-4 text-sm md:text-md text-gray-500">Presented by</h3>
      </section>
      <nav className="nav grid gap-4 md:grid-cols-3 pb-12 pt-12 justify-items-center">
        <a href="#overview" className="md:text-lg lg:text-xl">
          Overview
        </a>
        <a href="#points" className="md:text-lg lg:text-xl">
          Points System
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.road-results.com/BUMPS"
          className="md:text-lg lg:text-xl"
        >
          Series Results
        </a>
      </nav>
      <main>
        <section className="hill-listing">
          {data.allEvents
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((event) => {
              if (event.results || event.registration) {
                return (
                  <a
                    className="hill-link"
                    href={event.results ? event.results : event.registration}
                    key={event.title}
                    target="_blank"
                    rel="noopener"
                  >
                    <Hillclimb key={event.title} event={event}></Hillclimb>
                  </a>
                );
              }
              return <Hillclimb key={event.title} event={event}></Hillclimb>;
            })}
        </section>
        <section
          id="overview"
          className="prose body-text mt-0 p-8 md:mt-12 md:text-lg"
        >
          <h2>Overview</h2>
          <p>
            BUMPS, short for Bike Up the Mountain Points Series, is a yearlong
            competition featuring some of the most challenging and
            well-established cycling hill climb events in the Northeast United
            States.
          </p>
          <p>
            Entering a BUMPS event includes automatic entry into the overall
            series standings. Riders accumulate points in up to three races, and
            those entering more than three races are scored based on their best
            three results.
          </p>
          <p>
            Each event is run by an independent organizer. Event formats and
            prizes are determined independently. BUMPS aims to bring additional
            acknowledgment to riders who enjoy the challenge of climbing.
          </p>
        </section>
        <section
          id="points"
          className="prose body-text mt-0 p-8 md:mt-6 md:text-lg"
        >
          <h2>Points System</h2>
          <p>
            We use a unique formula that takes into account your finishing time,
            the fastest time, and the average time to determine the number of
            points you will receive for each event. The fastest rider earns 100
            points, and the average finish time earns 50 points. If a rider
            finishes with a time that is twice the average time or slower, they
            will receive one point.
          </p>
          <p>
            The scoring system prioritizes fast times, similar to a time trial,
            over your finishing position.
          </p>
          <p>
            To calculate your points, use this equation:
            <br />
            Points = 100 - 50 * [(Your Time - Fastest Time) / (Average Time -
            Fastest Time)]
          </p>
          <p className="italic">
            Example: In a race where the fastest time is 1:00 and the average
            finish time is 1:30: Finishing in 1:15 earns 75 points, 1:30 earns
            50 points, 1:45 earns 25 points, and finish times of 2:00 or slower
            earn one point.
          </p>

          <p>
            Each event will utilize its own timing system to determine category
            winners and distribute event-specific awards. The results of each
            race will subsequently be incorporated into the BUMPS scoring
            system, with the best three race scores counting towards each
            rider&apos;s total. Participation in any of the series events
            automatically qualifies racers for the BUMPS series.
          </p>
          <h3 className="bold">Categories</h3>
          <p>
            Male: Overal, Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74,
            75-79, 80+
            <br />
            Female: Overall, Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74,
            75-79, 80+
            <br />
            Overall unicycle
            <br />
            Overall tandem
            <br />
          </p>
          <p>
            * Age categories are determined by a rider&apos;s age at the end of
            the year. Please note that your age category for individual races
            may differ from that of the BUMPS series.
          </p>
          <p>
            Series Results:{" "}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.road-results.com/BUMPS"
            >
              road-results.com/BUMPS
            </a>
          </p>
        </section>
        <section className="prose body-text mt-0 p-8 md:mt-6 md:text-lg">
          <h2>Sponsors</h2>
          <p>
            <div className="text-m pb-4">2024 Title Sponsor</div>
            <a target="_blank" rel="noopener" href="https://cyclinghero.cc/">
              <Image
                src={cyclingHeroLogo}
                alt="Cycling Hero"
                width={200}
                priority
              />
            </a>
            <br />
          </p>
          <p>
            Thanks to{" "}
            <a target="_blank" rel="noopener" href="https://pjammcycling.com/">
              PJAMM Cycling
            </a>{" "}
            for helping promote the series and providing photography for
            Ascutney, Mt. Washington, Greylock and Allen Clark events!
          </p>
          <p>
            Interested in sponsoring the BUMPS series? Drop us a line at
            info@bumpshillclimb.com!
          </p>
        </section>
      </main>
    </div>
  );
}
