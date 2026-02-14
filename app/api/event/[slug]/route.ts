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

    const localLegends = supabase
      .from("event_participation_stats")
      .select("*")
      .eq("event_slug", slug)
      .order("appearance_count", {ascending: false})
      .order("most_recent_appearance", {ascending: false})
      .limit(20);

    const mostPoints = supabase
      .from("event_participation_stats")
      .select("*")
      .eq("event_slug", slug)
      .order("total_event_points", {ascending: false})
      .limit(5);

    const mostOverallWins = supabase
      .from("event_participation_stats")
      .select("*")
      .eq("event_slug", slug)
      .order("overall_wins", {ascending: false})
      .limit(10);

    const youngest = supabase
      .from("event_participation_stats")
      .select("*")
      .eq("event_slug", slug)
      .order("min_age_attained", {ascending: true})
      .limit(10);

    const oldest = supabase
      .from("event_participation_stats")
      .select("*")
      .eq("event_slug", slug)
      .order("max_age_attained", {ascending: false})
      .limit(10);

    // Run queries in parallel for better performance
    const [
      racesRes,
      maleRes,
      femaleRes,
      legends,
      points,
      overallWins,
      youngestRes,
      oldestRes,
    ] = await Promise.all([
      raceQuery,
      maleRecordQuery,
      femaleRecordQuery,
      localLegends,
      mostPoints,
      mostOverallWins,
      youngest,
      oldest,
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
      legends: {
        appearances: legends.data,
        points: points.data,
        wins: overallWins.data,
        youngest: youngestRes.data,
        oldest: oldestRes.data,
      },
    });
  } catch (error) {
    console.error("Error fetching event data:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}
