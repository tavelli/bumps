import {createClient} from "@/app/lib/supbase/server";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const {slug} = params as {slug: string};

    const cookieStore = await cookies();
    const supabase = await createClient();

    const query = supabase
      .from("event_race_details")
      .select("race_id, race_date, race_year, event_name, event_id")
      .eq("event_slug", slug)
      .order("race_date", {ascending: false});

    const {data: races, error} = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({races: []}, {status: 200});
    }

    return NextResponse.json({
      races: races || [],
    });
  } catch (error) {
    console.error("Error fetching event data:", error);
    return NextResponse.json([], {status: 500});
  }
}
