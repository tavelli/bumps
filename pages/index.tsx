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
                Registration
              </a>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
