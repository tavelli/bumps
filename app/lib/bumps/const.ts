import {BadgeData, EventStats} from "./model";

export const years = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2019",
  "2018",
  "2015",
  "2014",
  "2013",
];
export const categories: string[] = [
  "Overall Men",
  "Overall Women",
  "Under 20 Men",
  "20-29 Men",
  "30-39 Men",
  "40-49 Men",
  "50-59 Men",
  "60-69 Men",
  "70-74 Men",
  "75-79 Men",
  "80+ Men",
  "Under 20 Women",
  "20-29 Women",
  "30-39 Women",
  "40-49 Women",
  "50-59 Women",
  "60-69 Women",
  "70-74 Women",
  "75-79 Women",
  "80+ Women",
];

export const latestYear = years[0];

export const eventStats: EventStats[] = [
  {
    slug: "high-point",
    elevationGain: 1511,
  },
  {
    slug: "prospect",
    elevationGain: 1610,
  },
  {
    slug: "ascutney",
    elevationGain: 2279,
  },
  {
    slug: "allen-clark",
    elevationGain: 1600,
  },
  {
    slug: "greylock",
    elevationGain: 2805,
  },
  {
    slug: "mt-washington",
    elevationGain: 4678,
  },
  {
    slug: "mt-washington-earlybird",
    elevationGain: 4678,
  },
  {
    slug: "newtons-revenge",
    elevationGain: 4678,
  },
  {
    slug: "kearsarge",
    elevationGain: 2156,
  },
  {
    slug: "whiteface",
    elevationGain: 3500,
  },
  {
    slug: "crank-the-kanc",
    elevationGain: 2340,
  },
  {
    slug: "wachusett",
    elevationGain: 1067,
  },
  {
    slug: "okemmo",
    elevationGain: 2096,
  },
  {
    slug: "equinox",
    elevationGain: 3143,
  },
];

export const eventElevationMap = new Map(
  eventStats.map((item) => [item.slug, item.elevationGain]),
);

export const badgeList: BadgeData[] = [
  {
    slug: "high-point",
    name: "High Point",
    svg: "highpoint.svg",
    isLegacy: false,
  },
  {
    slug: "crank-the-kanc",
    name: "Kancamangus Pass",
    svg: "kanc.svg",
    isLegacy: false,
  },
  {
    slug: "whiteface",
    name: "Whiteface",
    svg: "whiteface.svg",
    isLegacy: false,
  },
  {
    slug: "ascutney",
    name: "Mt. Ascutney",
    svg: "ascutney.svg",
    isLegacy: false,
  },
  {
    slug: "kearsarge",
    name: "Mt. Kearsarge",
    svg: "kearsarge.svg",
    isLegacy: false,
  },
  {
    slug: "mt-washington",
    altSlugs: ["mt-washington-earlybird", "newtons-revenge"],
    name: "Mt. Washington",
    svg: "mtwashington.svg",
    isLegacy: false,
  },

  {
    slug: "greylock",
    name: "Mt. Greylock",
    svg: "greylock.svg",
    isLegacy: false,
  },
  {
    slug: "prospect",
    name: "Prospect Mountain",
    svg: "prospect.svg",
    isLegacy: false,
  },
  {
    slug: "allen-clark",
    name: "Appalachian Gap",
    svg: "appgap.svg",
    isLegacy: false,
  },
  {
    slug: "wachusett",
    name: "Mt. Wachusett",
    svg: "wachusett.svg",
    isLegacy: true,
  },
  {
    slug: "okemo",
    name: "Mt. Okemo",
    svg: "okemo.svg",
    isLegacy: true,
  },
  {
    slug: "equinox",
    name: "Mt. Equinox",
    svg: "equinox.svg",
    isLegacy: true,
  },
];
