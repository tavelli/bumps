import Filters from "@/app/components/Filters";
import {Racetime} from "@/app/components/RaceTIme";
import {RiderRank} from "@/app/components/RiderRank";
import {categories} from "@/app/lib/bumps/const";
import {RaceData} from "@/app/lib/bumps/model";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense, useState, useEffect, useMemo} from "react";

interface ClientProps {
  slug: string;
  races: RaceData[];
}

export default function EventResults({slug, races}: ClientProps) {
  const searchParams = useSearchParams();

  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [raceLoading, setRaceLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const selectedYear = searchParams.get("year");
  const selectedCat = searchParams.get("category") || "Overall Men";

  const raceYears = useMemo(() => {
    if (!races) return [];
    return races
      .map((r: any) => r.race_year.toString())
      .sort((a: string, b: string) => parseInt(b) - parseInt(a));
  }, [races]);

  const raceYear = selectedYear ? selectedYear : raceYears[0];

  // Logic: Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedCat]);

  // Logic: Fetch Paginated Results
  useEffect(() => {
    const selectedRaceId = races.find(
      (r: any) => r.race_year.toString() === raceYear,
    )?.race_id;
    if (!selectedRaceId) return;

    setRaceLoading(true);
    fetch(
      `/api/race/${selectedRaceId}/?category=${encodeURIComponent(selectedCat)}&page=${currentPage}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results);
        setTotalCount(data.count);
      })
      .finally(() => setRaceLoading(false));
  }, [selectedYear, selectedCat, currentPage, races]);

  return (
    <div>
      <h2 className="subcategory-heading mt-16 ml-4 lg:ml-0" id="results">
        Results
      </h2>
      <div className="mt-8 ml-4 lg:ml-0">
        <Filters
          years={raceYears}
          categories={categories}
          isLeaderboard={false}
        />
      </div>
      {raceLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-white rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th
                  className="py-4 px-6 text-left text-sm uppercase tracking-wide"
                  style={{width: "80px"}}
                >
                  Rank
                </th>
                <th
                  className="py-4 px-6 text-sm uppercase tracking-wide"
                  style={{width: "100px"}}
                >
                  Time
                </th>
                <th
                  className="hidden md:table-cell  py-4 px-6 text-right text-sm uppercase tracking-wide"
                  style={{width: "80px"}}
                >
                  Points
                </th>
                <th className="py-4 px-6 text-left text-sm uppercase tracking-wide">
                  Name
                </th>
                <th
                  className="hidden lg:table-cell py-4 px-6 text-left text-sm uppercase tracking-wide"
                  style={{width: "100px"}}
                >
                  Age
                </th>
              </tr>
            </thead>
            <tbody>
              {results?.map((r, i) => (
                <tr
                  key={r.rider_id + "-selectedCat"}
                  className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-base font-bold text-center">
                    <RiderRank
                      rank={(currentPage - 1) * itemsPerPage + i + 1}
                    />
                  </td>
                  <td className="py-4 px-6 font-mono text-base">
                    <Racetime time={r.race_time} />

                    <div className="md:hidden mt-2">{r.points} pts</div>
                  </td>
                  <td className="hidden md:table-cell py-4 px-6 font-mono text-base">
                    {r.points}
                  </td>
                  <td className="py-4 px-6 font-semibold">
                    <Link
                      href={`/leaderboard/profile/${r.rider_id}`}
                      className="underline"
                      prefetch={false}
                    >
                      {r.rider_name}
                    </Link>
                  </td>
                  <td className="hidden lg:table-cell py-4 px-6 text-gray-300 font-mono text-base">
                    {raceYear
                      ? parseInt(raceYear) - parseInt(r.birth_year)
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-t border-gray-700">
            <div className="text-gray-400">
              <span className="text-white">
                <span className="font-semibold ">{totalCount}</span>{" "}
                <span className="text-sm">participants</span>
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-bold uppercase letter-spacing-1 border border-white disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-white disabled:hover:outline-none"
              >
                &lt; Previous
              </button>
              {/* <span className="text-sm text-gray-400">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {Math.ceil(results.length / itemsPerPage) || 1}
                  </span>
                </span> */}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={results.length < itemsPerPage}
                className="px-3 py-2 text-sm font-bold uppercase letter-spacing-1 border border-white disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-white disabled:hover:outline-none"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
