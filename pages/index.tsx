import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";

import { Righteous } from "next/font/google";
import { format, parse, parseISO } from "date-fns";

import { request } from "../lib/datocms";
import bumpsLogo from "../public/bumpslogo_transparent.png";

interface HomepageQuery {
  allEvents: Event[];
}
interface Event {
  title: string;
  date: string;
  registration: string;
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
      className={`justify-between md:p-8 lg:p-16 min-h-screen ${righteous.className}`}
    >
      <header className="flex flex-col items-center pb-8 md:pb-16 pt-8 md:pt-0">
        <Image src={bumpsLogo} alt="BUMPS Logo" width={200} />
        <h1 className="sr-only">BUMPS</h1>
        <p className="text-xl sr-only">Bike Up the Mountain Points Series</p>
      </header>
      <section className="hill-listing">
        {data.allEvents.reverse().map((event) => (
          <div key={event.title} className="relative hill-wrapper">
            <div className="hill-photo">
              <img
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
                <a target="_blank" rel="noopener" href={event.registration}>
                  Register
                </a>
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
          The BUMPS (Bike Up the Mountain Points Series) is a series that
          recognizes the talents of riders who do the hardest thing in cycling,
          climb steep hills.
        </p>

        <p>
          Any rider who enters a BUMPS event will automatically be entered into
          the overall series points standings. There is no need to enter a
          separate BUMPS category. Riders will be scored according to their
          accumulated points in up to five races, and the totals of riders who
          enter more than five races will be determined by their best five
          scores. The official standings are on RoadResults:
          <a
            target="_blank"
            rel="noopener"
            href="https://www.road-results.com/BUMPS"
          >
            https://www.road-results.com/BUMPS
          </a>
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
          one point). This scoring system values fast times, like a time trial,
          not your place.
        </p>

        <p>
          (In past years there was a 1.2 multiplier for the Mt. Washington Auto
          Road Bicycle Hillclimb. In 2021 we have decided to eliminate that
          bonus. Ultimately, the goal of BUMPS is to encourage participation is
          an many events as possible. By removing the multiplier, participants
          who were unable to enter Mt. Washington can make up for it more easily
          by joining other events.){" "}
        </p>
      </section>
      <section id="points" className="prose body-text mt-0 p-8 md:p-0 md:mt-12">
        <h2>Series Scoring & Results</h2>
        <p>
          As noted each event will use their own timing system to establish
          winners in each category and provide their individual event awards.
          The race results will then be applied to the BUMPS scoring system
          using the 5 highest race scores for each rider. Every racer competing
          in any of the series races is automatically entered into the BUMPS
          series and will be scored. In addition to awarding overall male and
          female series leaders the following age categories will be scored:
        </p>
        <p>
          Male: Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74, 75-79, 80+
          <br />
          Female: Under 20, 20-29, 30-39, 40-49, 50-59, 60-69, 70-74, 75-79, 80+
          <br />
          Overall unicycle
          <br />
          Overall tandem
          <br />
        </p>
        <p>
          * Please note age categories are assigned based on a riders age at the
          end of the year. It is possible that your age category in individual
          races is different than for the BUMPS series. * Competitors in
          Clydesdale and Filly categories in individual races will be included
          in the BUMPS results but they will be assigned to their appropriate
          age category in the BUMPS scoring. BUMPS does not have a Clydesdale or
          Filly category.
        </p>
        <p>
          Results will be listed on-line after each event at RoadResults:{" "}
          <a
            target="_blank"
            rel="noopener"
            href="https://www.road-results.com/BUMPS"
          >
            https://www.road-results.com/BUMPS
          </a>
          .
        </p>
      </section>
    </main>
  );
}
