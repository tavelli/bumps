import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";

import { Righteous } from "next/font/google";
import { format, parseISO } from "date-fns";

import { request } from "../lib/datocms";
import bumpsLogo from "../public/bumps-logo.png";
import Head from "next/head";

interface HomepageQuery {
  allEvents: Event[];
}
interface Event {
  title: string;
  date: string;
  registration: string;
  results: string;
  coverPhoto: {
    url: string;
  };
}

const HOMEPAGE_QUERY = `query Events {
    allEvents {
      date
      title
      registration
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
    <main
      className={`justify-between md:p-8 lg:p-10 min-h-screen ${righteous.className}`}
    >
      <Head>
        <title>Bike Up the Mountain Point Series (BUMPS)</title>
        <meta
          name="description"
          content="Yearlong
          competition featuring some of the most challenging and
          well-established cycling hill climb events in the Northeast USA"
        />
      </Head>
      <header className="flex flex-col items-center pb-8 md:pb-16 pt-8 md:pt-0">
        <Image
          src={bumpsLogo}
          alt="Bike up Mountain Point Series Logo"
          width={250}
          className="pl-12 pr-12 md:pl-0 md:pr-0"
        />
        <h1 className="sr-only">BUMPS</h1>
        <p className="text-xl sr-only">Bike Up the Mountain Points Series</p>
      </header>
      <nav className="nav grid gap-4 md:grid-cols-3 pb-16 pt-8 justify-items-center">
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
      <section className="hill-listing">
        {data.allEvents.reverse().map((event) => (
          <div key={event.title} className="relative hill-wrapper">
            <div className="hill-photo">
              <Image
                src={event.coverPhoto.url}
                className=""
                alt={event.title}
                width={2000}
                height={530}
              />
            </div>
            <div className="hill-header top-1 md:top-4 lg:top-6">
              <h3 className="hill-title">{event.title}</h3>
              <p className="hill-date">{format(parseISO(event.date), "PP")}</p>
              <div className="hill-buttons mt-2 md:mt-4 lg:mt-8">
                {event.results ? (
                  <a target="_blank" rel="noopener" href={event.results}>
                    Results
                  </a>
                ) : event.registration ? (
                  <a target="_blank" rel="noopener" href={event.registration}>
                    Register
                  </a>
                ) : (
                  <span className="pending">Planned</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
      <section
        id="overview"
        className="prose body-text mt-0 p-8 md:p-0 md:mt-12"
      >
        <h2>Overview</h2>
        <p>
          BUMPS, short for Bike Up the Mountain Points Series, is a yearlong
          competition featuring some of the most challenging and
          well-established hill climb events in the Northeast United States.
        </p>
        <p>
          Entering a BUMPS event includes automatic entry into the overall
          series standings. Riders accumulate points in up to three races, and
          those entering more than three races are scored based on their best
          three results.
        </p>
        <p>
          Each event will continue to be run by an independent organizer, and
          event formats and prizes will continue to be determined independently.
          BUMPS simply wants to bring added acknowledgment to riders who enjoy
          the challenge of climbing.
        </p>
      </section>
      <section id="points" className="prose body-text mt-0 p-8 md:p-0 md:mt-12">
        <h2>Points System</h2>
        <p>
          The points scale is set for each race by the slope of the line
          intersecting the fastest and average finish times for that race; where
          the fastest rider earns 100 points and the average finish time
          receives 50 points. Any finish time twice the average less the fastest
          time, or slower, will receive one point. Scoring Equation: Your points
          = 100 – 50* [(Your Time – Fastest Time) / ( Average Time – Fastest
          Time)].
        </p>
        <p className="italic">
          Example: In a race where the fastest time is 1:00 and the average
          finish time is 1:30: Finishing in 1:15 earns 75 points, 1:30 earns 50
          points, 1:45 earns 25 points, and finish times of 2:00 or slower earn
          one point.
        </p>
        <p>
          The scoring system prioritizes fast times, similar to a time trial,
          over your finishing position.
        </p>

        <p>
          Each event will utilize its own timing system to determine category
          winners and distribute event-specific awards. The results of each race
          will subsequently be incorporated into the BUMPS scoring system, with
          the best three race scores counting towards each rider&apos;s total.
          Participation in any of the series events automatically qualifies
          racers for the BUMPS series.
        </p>
        <h3>Categories</h3>
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
          the year. Please note that your age category for individual races may
          differ from that of the BUMPS series.
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
          .
        </p>
      </section>
    </main>
  );
}
