import {createClient} from "@/app/lib/supbase/server";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedYear = searchParams.get("year") || "2025";
    const selectedCat = searchParams.get("category") || "Overall Men";

    const cookieStore = await cookies();
    const supabase = await createClient();

    // Build the query
    let query = supabase
      .from("categorized_results")
      .select("*")
      .eq("year", selectedYear)
      .order("season_points", {ascending: false})
      .limit(25);

    // Apply Category Logic
    if (!selectedCat.includes("Overall")) {
      query = query.eq("category_label", selectedCat);
    } else {
      const gender = selectedCat.includes("Men") ? "M" : "W";
      query = query.eq("gender", gender);
    }

    const {data: results, error} = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json([], {status: 200});
    }

    return NextResponse.json(results || []);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json([], {status: 500});
  }
}
