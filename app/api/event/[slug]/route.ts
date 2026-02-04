import {createClient} from "@/app/lib/supbase/server";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const {slug} = params as {slug: string};

    const supabase = await createClient();

    // 1. Fetch the list of races for this event
    const raceQuery = supabase
      .from("event_race_details")
      .select("race_id, race_date, race_year, event_name, event_id")
      .eq("event_slug", slug)
      .order("race_date", {ascending: false});

    // 2. Fetch the fastest man (Course Record)
    const maleRecordQuery = supabase
      .from("rider_race_history")
      .select("rider_name, race_time, rider_id, year")
      .eq("event_slug", slug)
      .eq("gender", "M") // Adjust "M" based on your DB values
      .order("race_time", {ascending: true})
      .limit(1)
      .single();

    // 3. Fetch the fastest woman (Course Record)
    const femaleRecordQuery = supabase
      .from("rider_race_history")
      .select("rider_name, race_time, rider_id, year")
      .eq("event_slug", slug)
      .eq("gender", "W") // Adjust "W" or "F" based on your DB values
      .order("race_time", {ascending: true})
      .limit(1)
      .single();

    // Run queries in parallel for better performance
    const [racesRes, maleRes, femaleRes] = await Promise.all([
      raceQuery,
      maleRecordQuery,
      femaleRecordQuery,
    ]);

    if (racesRes.error) {
      console.error("Supabase error:", racesRes.error);
      return NextResponse.json({races: []}, {status: 200});
    }

    return NextResponse.json({
      races: racesRes.data || [],
      records: {
        male: maleRes.data || null,
        female: femaleRes.data || null,
      },
    });
  } catch (error) {
    console.error("Error fetching event data:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}
