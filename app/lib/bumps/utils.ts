import {EventLegend} from "./model";

export const getRiderCategory = (
  birthYear: number,
  gender: string,
  targetYear = 2026,
) => {
  const age = targetYear - birthYear;
  const genderSuffix = gender === "M" ? "Men" : "Women";
  let ageGroup = "";

  if (age < 20) {
    ageGroup = "Under 20";
  } else if (age >= 20 && age <= 29) {
    ageGroup = "20-29";
  } else if (age >= 30 && age <= 39) {
    ageGroup = "30-39";
  } else if (age >= 40 && age <= 49) {
    ageGroup = "40-49";
  } else if (age >= 50 && age <= 50) {
    ageGroup = "50-59";
  } else if (age >= 60 && age <= 69) {
    ageGroup = "60-69";
  } else if (age >= 70 && age <= 79) {
    ageGroup = "70-79";
  } else {
    ageGroup = "80+";
  }

  return `${ageGroup} ${genderSuffix}`;
};

const RACES_BY_YEAR: Record<number, number> = {
  2025: 4,
  2024: 4,
  2023: 3,
};

export const getRacesCountForYear = (year: number): number => {
  return RACES_BY_YEAR[year] ?? 5;
};

export const formatRaceTime = (timeString: string) => {
  if (!timeString) return "--:--.00";

  // 1. Remove the leading "00:" hours if they exist
  let cleanTime = timeString.replace(/^00:/, "");

  // 2. Check for decimal point
  if (!cleanTime.includes(".")) {
    // No decimal? Add .00
    return `${cleanTime}.00`;
  } else {
    // Has decimal? Ensure it has 2 digits (e.g., .4 becomes .40)
    const [time, ms] = cleanTime.split(".");
    return `${time}.${ms.padEnd(2, "0").substring(0, 2)}`;
  }
};

export const getOnlyTopLegends = (data: EventLegend[]): EventLegend[] => {
  return data.reduce(
    (acc, current) => {
      // 1. If this is the first item or higher than our current max
      if (current.appearance_count > acc.max) {
        return {
          max: current.appearance_count,
          items: [current], // Start a new list
        };
      }

      // 2. If this matches our current max, add to the "Tie" list
      if (current.appearance_count === acc.max && acc.max !== 0) {
        return {
          ...acc,
          items: [...acc.items, current],
        };
      }

      // 3. Otherwise, just keep what we have
      return acc;
    },
    {max: 0, items: [] as EventLegend[]},
  ).items;
};

export const formatOrdinal = (n: number, locale = "en-US"): string => {
  const rules = new Intl.PluralRules(locale, {type: "ordinal"});
  const suffix: Record<string, string> = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };
  // A mapping is needed because the 'select' result is a category ('one', 'two', etc.), not the suffix itself.
  const category = rules.select(n);
  return n + (suffix[category] || "th");
};
