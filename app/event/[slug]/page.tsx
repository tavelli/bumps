import {request} from "@/app/lib/datocms";
import {ALL_EVENTS_QUERY} from "@/app/lib/bumps/utils";
import EventClientPage from "./EventClientPage";
import {Metadata, ResolvingMetadata} from "next";

const EVENT_QUERY = `query Events($slug: String) {
    event(filter: {slug: {eq: $slug}}) {
      date, location, state, title, blurb, registration, results, activeEvent,
      note, category, gradient, distance, elevationGain,
      gradientProfile { url }, aiCoverPhotoAlt { url }
    }
}`;

interface Props {
  params: {slug: string};
}

export async function generateStaticParams() {
  const data = await request({
    query: ALL_EVENTS_QUERY,
    variables: {},
    includeDrafts: true,
    excludeInvalid: false,
  });

  // Log this if it fails again to see the structure:
  // console.log("Dato Response:", data);

  // Safely access the array.
  // Change 'allEvents' to match whatever the collection name is in your GraphQL query.
  const events = data?.allEvents || [];

  return events.map((event: any) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  const data = await request({
    query: EVENT_QUERY,
    variables: {slug},
    includeDrafts: true,
    excludeInvalid: true,
  });

  return {
    title: data?.event?.title || "Bumps Hillclimb",
    description: data?.event?.location || "",
  };
}

export default async function EventPage({params}: Props) {
  const {slug} = await params;

  // Fetch initial DatoCMS data on the server
  const data = await request({
    query: EVENT_QUERY,
    variables: {slug},
    includeDrafts: true,
    excludeInvalid: true,
  });

  return <EventClientPage slug={slug} initialDatoData={data.event} />;
}
