import {request} from "@/app/lib/datocms";
import {ALL_EVENTS_QUERY} from "@/app/lib/bumps/utils";
import {HillclimbEvent} from "@/app/lib/bumps/model";
import EventClientPage from "./EventClientPage";

const EVENT_QUERY = `query Events($slug: String) {
    event(filter: {slug: {eq: $slug}}) {
      date, location, state, title, blurb, registration, results,
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
    excludeInvalid: true,
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
