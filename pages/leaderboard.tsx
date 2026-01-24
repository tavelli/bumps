import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { uniteaSans } from "@/app/fonts";
import Filters from "./../app/components/Filters";
import { createClient } from "../app/lib/supbase/server";

interface LeaderboardProps {
  results: any[];
  years: string[];
  categories: string[];
  selectedYear: string;
  selectedCat: string;
}

export const getServerSideProps: GetServerSideProps<LeaderboardProps> = async (
  context
) => {
  try {
    const supabase = await createClient();

    // Get query parameters
    const selectedYear = (context.query.year as string) || "2025";
    const selectedCat = (context.query.category as string) || "Overall Men";

    // Build the query
    let query = supabase
      .from("categorized_results")
      .select("*")
      .eq("year", selectedYear)
      .order("points", { ascending: false });

    // Apply Category Logic
    if (!selectedCat.includes("Overall")) {
      query = query.eq("category_label", selectedCat);
    } else {
      const gender = selectedCat.includes("Men") ? "M" : "F";
      query = query.eq("gender", gender);
    }

    const { data: results } = await query;

    // Static options (or fetch these from DB)
    const years = ["2025", "2024", "2023"];
    const categories = [
      "Overall Men",
      "Overall Women",
      "40-49 Men",
      "40-49 Women",
    ];

    return {
      props: {
        results: results || [],
        years,
        categories,
        selectedYear,
        selectedCat,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return {
      props: {
        results: [],
        years: ["2025", "2024", "2023"],
        categories: [
          "Overall Men",
          "Overall Women",
          "40-49 Men",
          "40-49 Women",
        ],
        selectedYear: "2025",
        selectedCat: "Overall Men",
      },
      revalidate: 60,
    };
  }
};

export default function LeaderboardPage({
  results,
  years,
  categories,
  selectedYear,
  selectedCat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Leaderboard - BUMPS</title>
        <meta name="description" content="BUMPS Hillclimb Leaderboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={uniteaSans.className}>
        <main className="p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">BUMPS Leaderboard</h1>

          <Filters years={years} categories={categories} />

          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b-2 border-slate-200">
                <th className="py-2">Rank</th>
                <th className="py-2">Rider</th>
                <th className="py-2">Age</th>
                <th className="py-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {results?.map((r, i) => (
                <tr key={r.result_id} className="border-b hover:bg-slate-50">
                  <td className="py-2 text-slate-500">{i + 1}</td>
                  <td className="py-2 font-semibold">{r.rider_name}</td>
                  <td className="py-2">{r.age_at_race}</td>
                  <td className="py-2 text-right text-blue-700 font-mono">
                    {r.points.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
