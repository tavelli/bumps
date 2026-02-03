import Image from "next/image";
import {uniteaSans} from "@/app/fonts";
import {request} from "@/app/lib/datocms";

import bumpsInfographic from "@/public/bumps shapes.svg";

import {HillclimbLink} from "@/app/components/HillclimbLink";
import {Header} from "@/app/components/Header";
import {Footer} from "@/app/components/Footer";
import {HillclimbEvent} from "../lib/bumps/model";

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
      gradientProfile {
        url
      }
      aiCoverPhotoAlt {
        url
      }
      slug
    }
}`;

const numberOfRaces = "four";

async function getHomeData(): Promise<HomepageQuery> {
  const data = await request({
    query: HOMEPAGE_QUERY,
    variables: {},
    includeDrafts: true,
    excludeInvalid: true,
  });
  return data;
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <div className={`full-height ${uniteaSans.className}`}>
      <Header />

      <main>
        <div className="content-wrapper">
          <section style={{maxWidth: "900px", margin: "0 auto"}}>
            <div className="grid md:grid-cols-3 mt-16 gap-5">
              <div className="col-span-2">
                <h2 className={`section-heading`}>How to enter</h2>

                <div className="callout-heading-sm pt-4">
                  Participation in any event automatically qualifies racers for
                  the BUMPS series.
                </div>
                <p className="text-lg pt-2">
                  Racers accumulate points in up to{" "}
                  <strong>{numberOfRaces}</strong> races, and are scored based
                  on their <strong>best {numberOfRaces}</strong> results.
                </p>
              </div>
              <div className="justify-self-center">
                <Image src={bumpsInfographic} alt="" width={220} />
              </div>
            </div>
          </section>

          <section style={{maxWidth: "900px", margin: "2rem auto"}} id="join">
            <h2 className={`section-heading`}>Stay on top</h2>
            <p></p>
            <ul className="list-disc list-inside mt-4">
              <li className="text-lg">
                Receive exclusive discounts from BUMPS sponsors
              </li>
              <li className="text-lg">
                Stay up to date on series results, prizes, and more
              </li>
            </ul>
            <a
              style={{marginTop: "1.5rem"}}
              className="button-link"
              href="https://bumpshillclimb.substack.com/welcome"
              target="_blank"
            >
              Subscribe
            </a>
          </section>

          <h2 id="events" className={`mt-16 section-heading`}>
            Events
          </h2>
          <p className="pt-4">
            Each event is run by an independent organizer. Individual event
            format and prizes vary by event.
          </p>
          <div className="callout-heading pt-4"></div>
          <p className="text-lg"> </p>
          <section className="hill-listing pt-2">
            {data.allEvents
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((event) => {
                return (
                  <HillclimbLink
                    key={event.title}
                    event={event}
                  ></HillclimbLink>
                );
              })}
          </section>
          <section className="mt-16">
            <h2 className={`section-heading`} id="involved">
              Get involved
            </h2>
            <p className="pt-2" style={{maxWidth: "800px"}}>
              BUMPS is a volunteer-run cycling hillclimb series built on
              community, passion, and climbing hard stuff—together. Want to be
              part of it? Whether you're a rider, sponsor, organizer, or just
              someone who loves a good hill, there's a way to help.
            </p>

            <div className="grid md:grid-cols-2 mt-8 gap-5">
              <div>
                <h3 className="subcategory-heading">Volunteers</h3>
                <p className="pt-2">We're looking for people who can:</p>
                <ul className="list-disc list-inside mt-4">
                  <li>
                    Promote BUMPS at your local hillclimb (hand out flyers, talk
                    to riders)
                  </li>
                  <li>Help with photography and social posts</li>
                  <li>Offer creative or logistical help behind the scenes</li>
                </ul>
                <p className="pt-2">
                  <a
                    className="body-link"
                    href="mailto:info@bumpshillclimb.com"
                  >
                    Email us to get started!
                  </a>
                </p>
              </div>
              <div>
                <h3 className="subcategory-heading">Donors and Sponsors</h3>
                <p className="pt-2">
                  We're seeking support from people and brands who want to:
                </p>
                <ul className="list-disc list-inside mt-4">
                  <li>Contribute cash or prizes to support rider awards</li>
                  <li>Be part of our digital and on-site storytelling</li>
                  <li>
                    Reach passionate cyclists, triathletes, and outdoor
                    communities across the Northeast
                  </li>
                </ul>
                <p className="pt-2">
                  <a
                    className="body-link"
                    href="https://www.figma.com/deck/ir0qbVevAwOxcVOfBdOMQX/BUMPS-for-Sponsors"
                    target="_blank"
                  >
                    View sponsor deck
                  </a>
                </p>

                <p className="pt-2">
                  <a
                    className="body-link"
                    href="mailto:info@bumpshillclimb.com"
                  >
                    Email us to connect!
                  </a>
                </p>
              </div>
              <div>
                <h3 className="subcategory-heading">Event Organizers</h3>
                <p className="mt-2">Run a hillclimb? We'd love to:</p>
                <ul className="list-disc list-inside mt-4">
                  <li>
                    Help bring new riders to your event through series-wide
                    promotion
                  </li>
                  <li>
                    Offer leaderboard tracking and recognition for your top
                    finishers
                  </li>
                  <li>Share resources to make your race even more impactful</li>
                </ul>
                <p className="pt-2">
                  <a
                    className="body-link"
                    href="https://www.figma.com/deck/FGXwSJTEiGEQmdN2MSHOF6/BUMPS-for-Organizers"
                    target="_blank"
                  >
                    View organizer info
                  </a>
                </p>

                <p className="pt-2">
                  <a
                    className="body-link"
                    href="mailto:info@bumpshillclimb.com"
                  >
                    Email us directly
                  </a>
                </p>
              </div>
            </div>
          </section>
          <section className="mt-16">
            <h2 className={`section-heading`} id="info">
              Info
            </h2>
            <div className="callout-heading-sm pt-4">
              The scoring system prioritizes fast times, similar to a time
              trial, over your finishing position.
            </div>
            <p className="pt-2">
              We use a unique formula that takes into account your finishing
              time, the fastest time, and the average time to determine the
              number of points you will receive for each event. The fastest
              rider earns 100 points, and the average finish time earns 50
              points. If a rider finishes with a time that is twice the average
              time or slower, they will receive one point.
            </p>

            <p className="pt-2 font-bold">
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
                  * Age categories are determined by a rider&apos;s{" "}
                  <strong>age at the end of the year</strong>. Please note that
                  your age category for individual races may differ from that of
                  the BUMPS series.
                </p>
              </div>
            </div>
          </section>
          <section className="mt-16">
            <div className="grid md:grid-cols-2 mt-8 gap-5">
              <div>
                <h3 className="subcategory-heading">Past champions</h3>
                <table className="mt-2">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Men's</th>
                      <th>Women's</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2025"
                          target="_blank"
                        >
                          2025
                        </a>
                      </td>
                      <td>Joshua Mcdougal</td>
                      <td>Kristen Kulchinsky</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2024"
                          target="_blank"
                        >
                          2024
                        </a>
                      </td>
                      <td>Cameron Cogburn</td>
                      <td>Kristen Kulchinsky</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2023"
                          target="_blank"
                        >
                          2023
                        </a>
                      </td>
                      <td>Alan Boguslawski</td>
                      <td>Kristen Kulchinsky</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2022"
                          target="_blank"
                        >
                          2022
                        </a>
                      </td>
                      <td>Alan Boguslawski</td>
                      <td>Sonya Bodick</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2021"
                          target="_blank"
                        >
                          2021
                        </a>
                      </td>
                      <td>Erik Levinsohn</td>
                      <td>Julie Smith</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2019"
                          target="_blank"
                        >
                          2019
                        </a>
                      </td>
                      <td>Alan Boguslawski</td>
                      <td>Caroline Roush</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2018"
                          target="_blank"
                        >
                          2018
                        </a>
                      </td>
                      <td>Erik Vandendries</td>
                      <td>Johanna Lawrence</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2015"
                          target="_blank"
                        >
                          2015
                        </a>
                      </td>
                      <td>Chris Yura</td>
                      <td>Victoria Di savino</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2014"
                          target="_blank"
                        >
                          2014
                        </a>
                      </td>
                      <td>Chris Yura</td>
                      <td>Marti Shea</td>
                    </tr>
                    <tr>
                      <td>
                        <a
                          className="body-link"
                          href="https://www.road-results.com/?n=series&sn=bumps&y=2013"
                          target="_blank"
                        >
                          2013
                        </a>
                      </td>
                      <td>Eric Follen</td>
                      <td>Silke Wunderwald</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
