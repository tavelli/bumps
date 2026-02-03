export interface HillclimbEvent {
  title: string;
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
