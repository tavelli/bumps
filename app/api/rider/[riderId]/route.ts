import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/app/lib/supbase/server";

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const {riderId} = params as {riderId: string};
    const supabase = await createClient();

    // Try riders table

    let {data: results, error} = await supabase
      .from("rider_race_history")
      .select(
        `
        rider_name,
        birth_year,
        event_name,
        race_date,
        points,
        overall_rank,
        overall_total,
        category_total,
        category_rank,
        category_total,
        year
    `,
      )
      .eq("rider_id", riderId)
      .order("year", {ascending: false})
      .order("race_date", {ascending: true});

    if (error) {
      results = null;
    }

    if (!results) {
      return NextResponse.json({error: "not_found"}, {status: 404});
    }

    return NextResponse.json({
      name: results[0].rider_name,
      age: results[0].birth_year
        ? new Date().getFullYear() - results[0].birth_year
        : null,
      results: results,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "server_error"}, {status: 500});
  }
}
