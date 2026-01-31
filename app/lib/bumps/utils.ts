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
