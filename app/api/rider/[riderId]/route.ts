import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/app/lib/supbase/server";

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const {riderId} = params as {riderId: string};
    const supabase = await createClient();

    // Run both queries in parallel for better performance
    const [historyResponse, standingsResponse] = await Promise.all([
      // Query 1: Individual Race History
      supabase
        .from("rider_race_history")
        .select(
          `
          rider_name,
          birth_year,
          event_name,
          event_slug,
          race_date,
          race_time,
          race_id, 
          points,
          overall_rank,
          overall_total,
          category_total, 
          category_rank,
          year
        `,
        )
        .eq("rider_id", riderId)
        .order("year", {ascending: false})
        .order("race_date", {ascending: true}),

      // Query 2: Season Standings (from categorized_results view)
      supabase
        .from("categorized_results")
        .select(
          `
          year,
          overall_standing_rank,
          category_standing_rank,
          category_label,
          season_points
        `,
        )
        .eq("rider_id", riderId)
        .order("year", {ascending: false}),
    ]);

    if (
      historyResponse.error ||
      !historyResponse.data ||
      historyResponse.data.length === 0
    ) {
      return NextResponse.json({error: "rider_not_found"}, {status: 404});
    }

    console.log("Standings Response:", standingsResponse);

    return NextResponse.json({
      name: historyResponse.data[0].rider_name,
      age: historyResponse.data[0].birth_year
        ? new Date().getFullYear() - historyResponse.data[0].birth_year
        : null,
      results: historyResponse.data,
      standings: standingsResponse.data || [], // Returns their rank per year
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "server_error"}, {status: 500});
  }
}
