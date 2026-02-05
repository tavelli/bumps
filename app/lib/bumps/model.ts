export interface HillclimbEvent {
  title: string;
  blurb: string;
  date: string;
  location: string;
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
