export interface HillclimbEvent {
  title: string;
  blurb: string;
  date: string;
  location: string;
  state: string;
  registration: string;
  results: string;
  note: string;
  category: string;
  gradient: number;
  distance: number;
  elevationGain: number;
  gradientProfile: {
    url: string;
  };
  aiCoverPhotoAlt: {
    url: string;
  };
  slug: string;
}

export interface PodiumRider {
  rider_name: string;
  rank: number;
  year: number;
  season_points: number;
  rider_id: string;
  category_display: string;
}

export interface CourseRecords {
  male: {
    rider_name: string;
    rider_id: string;
    race_time: string;
    year: string;
  };
  female: {
    rider_name: string;
    rider_id: string;
    race_time: string;
    year: string;
  };
}

export interface RiderResult {
  rider_name: string;
  birth_year: number;
  event_name: string;
  event_slug: string;
  race_date: string;
  race_time: string;
  race_id: string;
  points: number;
  overall_rank: number;
  overall_total: number;
  category_total: number;
  category_rank: number;
  year: number;
}

export interface EventStats {
  slug: string;
  elevationGain: number;
}

export interface PrStats {
  event_slug: string;
  fastest_time: string;
  entry_count: number;
}
