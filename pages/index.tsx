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
      results
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
    <main className={`justify-between  min-h-screen ${righteous.className}`}>
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
      <section className="flex flex-col items-center pb-8  presentd-by">
        <h3 className="p-4 text-sm md:text-md text-gray-600">PRESENTED BY</h3>
        <a target="_blank" rel="noopener" href="https://cyclinghero.cc/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="218.296"
            height="41.767"
            viewBox="0 0 218.296 41.767"
          >
            <g transform="translate(-110 -26.588)">
              <path
                d="M883.722,203.1H881.8a.149.149,0,0,0-.166.166v.1a.152.152,0,0,0,.132.171.147.147,0,0,0,.034,0h.7V205.7a.149.149,0,0,0,.13.166.145.145,0,0,0,.036,0h.188a.151.151,0,0,0,.166-.134.154.154,0,0,0,0-.032v-2.161h.7a.155.155,0,0,0,.166-.142.151.151,0,0,0,0-.03v-.1a.151.151,0,0,0-.129-.169A.154.154,0,0,0,883.722,203.1Z"
                transform="translate(-559.137 -163.938)"
                fill="#fd6b35"
              ></path>
              <path
                d="M898.318,203.254a.154.154,0,0,0-.15-.159h-.27a.188.188,0,0,0-.188.13l-.778,1.883-.783-1.883a.188.188,0,0,0-.188-.13h-.249a.153.153,0,0,0-.169.134.162.162,0,0,0,0,.024l-.23,2.431a.145.145,0,0,0,.107.174.143.143,0,0,0,.054,0h.188a.158.158,0,0,0,.152-.149l.151-1.755.715,1.751a.188.188,0,0,0,.188.132h.083a.188.188,0,0,0,.188-.132l.715-1.751.151,1.755a.156.156,0,0,0,.154.159h.208a.147.147,0,0,0,.162-.177Z"
                transform="translate(-570.238 -163.938)"
                fill="#fd6b35"
              ></path>
              <path
                d="M128.189,227.675h-2.421l-2.792-.045a.181.181,0,0,1-.045,0,4.161,4.161,0,0,1-3.174-5.893l.013-.028A4.178,4.178,0,0,1,123.5,219.4h3.472a.3.3,0,0,0,.292-.241l.425-2.19a.3.3,0,0,0-.237-.35.293.293,0,0,0-.054-.005h-3.816a6.927,6.927,0,1,0-.14,13.853h4.319a.3.3,0,0,0,.292-.241l.425-2.19a.3.3,0,0,0-.231-.351A.3.3,0,0,0,128.189,227.675Z"
                transform="translate(61.888 -174.909)"
                fill="#fd6b35"
              ></path>
              <path
                d="M270.292,216.59h-3.824a6.927,6.927,0,1,0-.14,13.853h1.442a.3.3,0,0,0,.292-.243l.416-2.2a.3.3,0,0,0-.235-.348.289.289,0,0,0-.053-.005l-2.325-.038a.182.182,0,0,1-.045,0,4.16,4.16,0,0,1-3.174-5.893l.013-.028a4.18,4.18,0,0,1,3.728-2.312h3.472a.3.3,0,0,0,.292-.241l.377-1.975.041-.217a.3.3,0,0,0-.235-.352A.308.308,0,0,0,270.292,216.59Z"
                transform="translate(-54.1 -174.893)"
                fill="#fd6b35"
              ></path>
              <path
                d="M199.314,216.558h-3.071a.3.3,0,0,0-.235.115l-4.165,5.288h-.019l-2.239-5.223a.3.3,0,0,0-.273-.188H186.2a.3.3,0,0,0-.294.254v.049a.3.3,0,0,0,.028.188l3.85,7.644a.285.285,0,0,1,.028.188l-.911,5.194a.3.3,0,0,0,.242.344.314.314,0,0,0,.051,0h2.463a.3.3,0,0,0,.294-.247l.934-5.356a.3.3,0,0,1,.068-.145l6.62-7.672a.2.2,0,0,0,.043-.1.3.3,0,0,0-.253-.34A.3.3,0,0,0,199.314,216.558Z"
                transform="translate(5.606 -174.86)"
                fill="#fd6b35"
              ></path>
              <path
                d="M331.391,228.009h-5.565a.3.3,0,0,1-.3-.3.291.291,0,0,1,0-.051l1.9-10.72a.3.3,0,0,0-.244-.346.291.291,0,0,0-.05,0h-2.461a.3.3,0,0,0-.294.247l-2.329,13.258a.3.3,0,0,0,.242.344.312.312,0,0,0,.051,0h8.73a.3.3,0,0,0,.294-.247l.314-1.839a.3.3,0,0,0-.246-.344A.306.306,0,0,0,331.391,228.009Z"
                transform="translate(-104.904 -174.893)"
                fill="#fd6b35"
              ></path>
              <path
                d="M391.226,216.59h-2.463a.3.3,0,0,0-.294.247l-2.329,13.258a.3.3,0,0,0,.242.344.312.312,0,0,0,.051,0H388.9a.3.3,0,0,0,.294-.247l2.329-13.256a.3.3,0,0,0-.24-.345A.3.3,0,0,0,391.226,216.59Z"
                transform="translate(-156.928 -174.893)"
                fill="#fd6b35"
              ></path>
              <path
                d="M436.133,216.59h-2.463a.3.3,0,0,0-.284.247l-1.275,7.277a.3.3,0,0,1-.554.092l-4.142-7.461a.3.3,0,0,0-.26-.154h-1.935a.3.3,0,0,0-.294.247l-2.348,13.237a.3.3,0,0,0,.24.346.3.3,0,0,0,.054,0h2.463a.3.3,0,0,0,.292-.247l1.318-7.343a.3.3,0,0,1,.554-.09l4.142,7.531a.3.3,0,0,0,.262.154h1.909a.3.3,0,0,0,.294-.247l2.329-13.256a.3.3,0,0,0-.255-.334A.287.287,0,0,0,436.133,216.59Z"
                transform="translate(-186.505 -174.892)"
                fill="#fd6b35"
              ></path>
              <path
                d="M518.626,222.135h-5.083a.3.3,0,0,0-.292.247l-.386,2.193a.3.3,0,0,0,.242.344.311.311,0,0,0,.051,0h2.088a.3.3,0,0,1,.292.354l-.409,2.143a.3.3,0,0,1-.3.241l-2.237-.034h-.045a4.16,4.16,0,0,1-3.174-5.893l.013-.03a4.18,4.18,0,0,1,3.73-2.319h3.472a.3.3,0,0,0,.292-.241l.377-1.975.041-.217a.3.3,0,0,0-.238-.347.308.308,0,0,0-.056-.005H513.2a6.926,6.926,0,1,0-.14,13.851h4.09a.3.3,0,0,0,.3-.239l1.478-7.73a.3.3,0,0,0-.244-.342A.286.286,0,0,0,518.626,222.135Z"
                transform="translate(-254.377 -174.901)"
                fill="#fd6b35"
              ></path>
              <path
                d="M603.318,216.6h-6.757a.3.3,0,0,0-.292.241l-.953,5.046a.3.3,0,0,1-.294.243H590.1a.3.3,0,0,1-.292-.354l.442-2.318h0l.476-2.5a.3.3,0,0,0-.234-.347.286.286,0,0,0-.058-.005h-2.242a.3.3,0,0,0-.292.241l-1.926,10.067h0l-.608,3.189a.3.3,0,0,0,.292.354h2.237a.3.3,0,0,0,.292-.241l.36-1.883h.011l.6-3.178a.3.3,0,0,1,.294-.243h4.929a.3.3,0,0,1,.292.354l-.906,4.833a.3.3,0,0,0,.236.348.288.288,0,0,0,.058.005h2.235a.3.3,0,0,0,.294-.241l2.071-10.82h0l4.8-2.223a.3.3,0,0,0-.136-.567Z"
                transform="translate(-318.644 -174.9)"
                fill="#fd6b35"
              ></path>
              <path
                d="M675.3,237.934h-5.433a.3.3,0,0,1-.3-.3.293.293,0,0,1,0-.05l.205-1.171a.3.3,0,0,0-.418-.322l-2.67,1.235a.3.3,0,0,0-.167.22l-1.051,5.978L665,246.25h8.943a.3.3,0,0,0,.294-.245l.377-2.191a.3.3,0,0,0-.292-.35h-5.43a.3.3,0,0,1-.3-.3.3.3,0,0,1,0-.054l.377-2.15a.3.3,0,0,1,.294-.247h5.648a.3.3,0,0,0,.294-.247l.377-2.191a.3.3,0,0,0-.242-.341Z"
                transform="translate(-383.29 -190.7)"
                fill="#fd6b35"
              ></path>
              <path
                d="M744.762,227.487a.294.294,0,0,0-.394-.131l-.031.018a2.1,2.1,0,0,1-1.13.377c-1.246,0-1.973-1.452-2.357-2.8a.3.3,0,0,1,.175-.358,4.159,4.159,0,0,0-1.517-8.032h-4.466a.3.3,0,0,0-.294.245l-2.329,13.258a.3.3,0,0,0,.238.344.288.288,0,0,0,.056,0h2.463a.3.3,0,0,0,.292-.245l.889-5.051a.3.3,0,0,1,.292-.247h1.16a.3.3,0,0,1,.294.25c.282,1.662,1.523,5.292,4.532,5.292a4.21,4.21,0,0,0,2.839-1.013.3.3,0,0,0,.087-.377Zm-5.245-5.385h-2.276a.3.3,0,0,1-.3-.3.308.308,0,0,1,0-.052l.377-2.15a.3.3,0,0,1,.294-.245h1.9v-.023a1.389,1.389,0,0,1,0,2.777Z"
                transform="translate(-438.012 -174.868)"
                fill="#fd6b35"
              ></path>
              <path
                d="M819.98,218.423c-7.393-5.582-15.721,2.747-10.138,10.138a.3.3,0,0,0,.064.064c7.391,5.582,15.721-2.747,10.138-10.138A.3.3,0,0,0,819.98,218.423Zm-1.971,8.1a.365.365,0,0,1-.066.066c-4.417,3.314-9.382-1.649-6.066-6.066a.357.357,0,0,1,.066-.066c4.417-3.308,9.38,1.655,6.066,6.072Z"
                transform="translate(-499.38 -174.899)"
                fill="#fd6b35"
              ></path>
              <path
                d="M704.911,205.57a.269.269,0,0,0-.092-.158h0c-.013-.011-.028-.019-.041-.028l-4.854-2.259a.3.3,0,0,0-.418.324l.407,2.133a.275.275,0,0,1,0,.111l-.407,2.131a.3.3,0,0,0,.418.326l4.859-2.259.036-.024h0a.27.27,0,0,0,.092-.156v-.124C704.911,205.566,704.913,205.574,704.911,205.57Z"
                transform="translate(-411.294 -163.939)"
                fill="#fd6b35"
              ></path>
              <path
                d="M704.911,205.57a.269.269,0,0,0-.092-.158h0c-.013-.011-.028-.019-.041-.028l-4.854-2.259a.3.3,0,0,0-.418.324l.407,2.133a.275.275,0,0,1,0,.111l-.407,2.131a.3.3,0,0,0,.418.326l4.859-2.259.036-.024h0a.27.27,0,0,0,.092-.156v-.124C704.911,205.566,704.913,205.574,704.911,205.57Z"
                transform="translate(-411.294 -163.939)"
                fill="#fd6b35"
              ></path>
              <g transform="translate(110 26.588)">
                <path
                  d="M300.481,183.229l-3,15.9a.477.477,0,0,1-.469.389H281.365a.477.477,0,0,1-.468-.564l1.361-7.317a.478.478,0,0,1,.468-.389l7.253-.009a.477.477,0,0,0,.468-.385l1.447-7.443a.477.477,0,0,0-.468-.568H270.848a21.076,21.076,0,0,0-21.129,20.67A20.9,20.9,0,0,0,270.6,224.6h13.207a.477.477,0,0,0,.468-.386l1.447-7.441a.476.476,0,0,0-.468-.568H277.45L269,216.066a.544.544,0,0,1-.071-.006,12.609,12.609,0,0,1-10.8-12.148A12.5,12.5,0,0,1,270.6,191.234h2.58a.477.477,0,0,1,.468.568l-3.963,20.513a.478.478,0,0,0,.468.568l7.613.014a.478.478,0,0,0,.468-.378l.9-4.22a.476.476,0,0,1,.466-.378h15.643a.476.476,0,0,1,.468.566l-2.967,15.554a.477.477,0,0,0,.468.566h7.6a.476.476,0,0,0,.468-.388l6.258-32.721a.474.474,0,0,1,.268-.343l15.973-7.405a.477.477,0,0,0-.2-.91H300.95a.478.478,0,0,0-.469.389"
                  transform="translate(-249.719 -182.84)"
                  fill="#fd6b35"
                ></path>
                <path
                  d="M300.481,183.229l-3,15.9a.477.477,0,0,1-.469.389H281.365a.477.477,0,0,1-.468-.564l1.361-7.317a.478.478,0,0,1,.468-.389l7.253-.009a.477.477,0,0,0,.468-.385l1.447-7.443a.477.477,0,0,0-.468-.568H270.848a21.076,21.076,0,0,0-21.129,20.67A20.9,20.9,0,0,0,270.6,224.6h13.207a.477.477,0,0,0,.468-.386l1.447-7.441a.476.476,0,0,0-.468-.568H277.45L269,216.066a.544.544,0,0,1-.071-.006,12.609,12.609,0,0,1-10.8-12.148A12.5,12.5,0,0,1,270.6,191.234h2.58a.477.477,0,0,1,.468.568l-3.963,20.513a.478.478,0,0,0,.468.568l7.613.014a.478.478,0,0,0,.468-.378l.9-4.22a.476.476,0,0,1,.466-.378h15.643a.476.476,0,0,1,.468.566l-2.967,15.554a.477.477,0,0,0,.468.566h7.6a.476.476,0,0,0,.468-.388l6.258-32.721a.474.474,0,0,1,.268-.343l15.973-7.405a.477.477,0,0,0-.2-.91H300.95a.478.478,0,0,0-.469.389"
                  transform="translate(-249.719 -182.84)"
                  fill="#fd6b35"
                ></path>
              </g>
            </g>
          </svg>
        </a>
      </section>
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
        {data.allEvents
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((event) => (
            <a
              href={event.results ? event.results : event.registration}
              key={event.title}
              target="_blank"
              rel="noopener"
            >
              <div className="relative hill-wrapper mb-2 md:mb-4">
                <div className="hill-photo">
                  <Image
                    src={event.coverPhoto.url}
                    className=""
                    alt={event.title}
                    fill={true}
                    sizes="(max-width: 768px) 100vw,
              (max-width: 1440px) 1440px"
                  />
                </div>
                <div className="hill-header top-1 md:top-4 lg:top-6">
                  <h3 className="hill-title">{event.title}</h3>
                  <p className="hill-date">
                    {format(parseISO(event.date), "PP")}
                  </p>
                  <div className="hill-buttons mt-2 md:mt-4 lg:mt-8">
                    {event.results ? (
                      <a
                        target="_blank"
                        rel="noopener"
                        className="results"
                        href={event.results}
                      >
                        Results
                      </a>
                    ) : event.registration ? (
                      <a
                        target="_blank"
                        rel="noopener"
                        href={event.registration}
                      >
                        Register
                      </a>
                    ) : (
                      <span className="pending">Planned</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
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
          finish time is 1:30: Finishing in 1:15 earns 75 points, 1:30 earns 50
          points, 1:45 earns 25 points, and finish times of 2:00 or slower earn
          one point.
        </p>

        <p>
          Each event will utilize its own timing system to determine category
          winners and distribute event-specific awards. The results of each race
          will subsequently be incorporated into the BUMPS scoring system, with
          the best three race scores counting towards each rider&apos;s total.
          Participation in any of the series events automatically qualifies
          racers for the BUMPS series.
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
        </p>
      </section>
      <section className="prose body-text mt-0 p-8 md:mt-6 md:text-lg">
        <h2>Sponsors</h2>
        <p>
          Thanks to{" "}
          <a target="_blank" rel="noopener" href="https://pjammcycling.com/">
            PJAMM Cycling
          </a>{" "}
          for helping promote the series and providing photography for Ascutney,
          Mt. Washington, Greylock and Allen Clark events!
        </p>
        <p>
          Interested in sponsoring the BUMPS series? Drop us a line at
          info@bumpshillclimb.com!
        </p>
      </section>
    </main>
  );
}
