import {createClient} from "@/app/lib/supbase/server";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedYear = searchParams.get("year") || "2025";
    const selectedCat = searchParams.get("category") || "Overall Men";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    const cookieStore = await cookies();
    const supabase = await createClient();

    // Build the query
    let query = supabase
      .from("categorized_results")
      .select("*", {count: "exact"})
      .eq("year", selectedYear)
      .order("season_points", {ascending: false})
      .range(offset, offset + itemsPerPage - 1);

    // Apply Category Logic
    if (!selectedCat.includes("Overall")) {
      query = query.eq("category_label", selectedCat);
    } else {
      const gender = selectedCat.includes("Men") ? "M" : "W";
      query = query.eq("gender", gender);
    }

    const {data: results, error, count} = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({results: [], count: 0}, {status: 200});
    }

    return NextResponse.json({results: results || [], count: count || 0});
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json([], {status: 500});
  }
}
