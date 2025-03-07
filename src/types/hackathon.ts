export interface DevfolioResponse {
  hits: {
    total: {
      value: number;
    };
    hits: DevfolioHit[];
  };
}

export interface DevfolioHit {
  _source: HackathonData;
}

export interface HackathonData {
  uuid: string;
  name: string;
  tagline: string;
  desc: string;
  slug: string;
  starts_at: string;
  ends_at: string;
  is_online: boolean;
  city: string;
  state: string;
  country: string;
  participants_count: number;
  location: string;
  cover_img: string;
  hackathon_setting: {
    logo: string;
    site: string;
    primary_color: string;
    reg_starts_at: string;
    reg_ends_at: string;
    women_only: boolean;
  };
  prizes: Prize[];
  sponsor_tiers: SponsorTier[];
  status: string;
  type: string;
  team_min: number;
  team_size: number; // Max team size
  themes: Theme[];
  apply_mode: string;
}

export interface Theme {
  name: string;
  uuid: string;
}

export interface Prize {
  uuid: string;
  name: string;
  desc: string;
  is_sponsor_prize: boolean;
}

export interface SponsorTier {
  name: string;
  sponsors: Sponsor[];
  uuid: string;
}

export interface Sponsor {
  name: string;
  logo: string;
  about: string | null;
  uuid: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface HackathonFilters {
  // Basic filters
  searchTerm: string;
  location: 'any' | 'in-person' | 'online';
  dateRange: 'any' | 'upcoming' | 'this-month' | 'next-month' | 'past' | 'custom';
  technologies: string[];
  
  // Advanced location filters
  country: string | null;
  state: string | null;
  city: string | null;
  
  // Event type filter
  eventType: string | null;
  
  // Custom date range
  startDate: string | null; // Format: YYYY-MM-DD
  endDate: string | null;   // Format: YYYY-MM-DD
  
  // Team size filter
  teamSizeMin: number | null;
  teamSizeMax: number | null;
  
  // Participation mode
  participationMode: 'any' | 'online' | 'offline' | 'hybrid' | null;
  
  // Prize filter
  prizeFilter: string | null;
  
  // Theme filter
  themeFilter: string[] | null;
  
  // Registration status
  registrationStatus: 'open' | 'closed' | 'any';
  registrationStartDate: string | null;
  registrationEndDate: string | null;
  
  // Pagination
  pageSize: number;
  pageNumber: number;
} 