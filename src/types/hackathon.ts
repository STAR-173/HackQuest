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
  };
  prizes: Prize[];
  sponsor_tiers: SponsorTier[];
  status: string;
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

export interface HackathonFilters {
  searchTerm: string;
  location: 'any' | 'in-person' | 'online';
  dateRange: 'any' | 'upcoming' | 'this-month' | 'next-month' | 'past';
  technologies: string[];
} 