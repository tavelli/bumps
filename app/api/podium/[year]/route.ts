import {createClient} from "@/app/lib/supbase/server";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const {year} = params as {year: string};

    const supabase = await createClient();

    const {data: winners, error} = await supabase
      .from("category_leaders")
      .select("*")
      .eq("year", year);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {results: [], error: error.message},
        {status: 200},
      );
    }

    return NextResponse.json({results: winners || []});
  } catch (error) {
    console.error("Error fetching podium data:", error);
    return NextResponse.json([], {status: 500});
  }
}
