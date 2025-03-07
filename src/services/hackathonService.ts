import { DevfolioResponse, HackathonFilters, HackathonData, GeoLocation } from '../types/hackathon';

// Original API URL
const DEVFOLIO_API_URL = 'https://api.devfolio.co/api/search/hackathons';
// Local development proxy URL
const LOCAL_PROXY_URL = '/api/devfolio/api/search/hackathons';
// Fallback public CORS proxy
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Default filter values to ensure nothing is missed when filtering
export const DEFAULT_FILTERS: HackathonFilters = {
  searchTerm: '',
  location: 'any',
  dateRange: 'any',
  technologies: [],
  country: null,
  state: null,
  city: null,
  eventType: null,
  startDate: null,
  endDate: null,
  teamSizeMin: null,
  teamSizeMax: null,
  participationMode: null,
  prizeFilter: null,
  themeFilter: null,
  registrationStatus: 'any',
  registrationStartDate: null,
  registrationEndDate: null,
  pageSize: 50, // Increased page size to fetch more hackathons at once
  pageNumber: 0
};

export const fetchHackathons = async (
  filters: HackathonFilters,
  from = 0,
  size = 50 // Increased default size to fetch more hackathons at once
): Promise<DevfolioResponse> => {
  // Merge with default filters to ensure all fields are set
  const mergedFilters = { ...DEFAULT_FILTERS, ...filters };

  // Build API query parameters based on filters
  const apiParams: any = {
    type: 'application_open',
    from: from || mergedFilters.pageNumber * mergedFilters.pageSize,
    size: size || mergedFilters.pageSize,
  };

  // Add country filter if specified
  if (mergedFilters.country) {
    apiParams.country = mergedFilters.country;
  }

  // Add state filter if specified
  if (mergedFilters.state) {
    apiParams.state = mergedFilters.state;
  }

  // Add city filter if specified
  if (mergedFilters.city) {
    apiParams.city = mergedFilters.city;
  }

  // Add event type filter if specified
  if (mergedFilters.eventType) {
    apiParams.type = mergedFilters.eventType;
  }

  // Base request options
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'sec-ch-ua-platform': 'Windows',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'Sec-Fetch-Site': 'same-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
    },
    body: JSON.stringify(apiParams),
  };

  // Try different approaches in sequence
  
  // First try: Local development proxy
  try {
    console.log('Attempting to fetch hackathons via local proxy...', apiParams);
    const response = await fetch(LOCAL_PROXY_URL, requestOptions);
    
    if (response.ok) {
      const data: DevfolioResponse = await response.json();
      console.log('Successfully fetched hackathons via local proxy');
      return data;
    }
  } catch (error) {
    console.error('Error fetching hackathons via local proxy:', error);
  }
  
  // Second try: Public CORS proxy
  try {
    console.log('Attempting to fetch hackathons via CORS proxy...', apiParams);
    const proxyUrl = `${CORS_PROXY}${DEVFOLIO_API_URL}`;
    
    // Need to add origin header for the CORS proxy
    const corsProxyOptions = {
      ...requestOptions,
      headers: {
        ...requestOptions.headers,
        'Origin': window.location.origin,
        'host': 'api.devfolio.co',
      }
    };
    
    const response = await fetch(proxyUrl, corsProxyOptions);
    
    if (response.ok) {
      const data: DevfolioResponse = await response.json();
      console.log('Successfully fetched hackathons via CORS proxy');
      return data;
    }
  } catch (error) {
    console.error('Error fetching hackathons via CORS proxy:', error);
  }
  
  // Fallback: Mock data
  console.log('Using mock hackathon data as fallback');
  return createMockHackathons();
};

// Create mock data as a fallback if the API request fails
const createMockHackathons = (): DevfolioResponse => {
  const mockHackathons = Array(6).fill(null).map((_, index) => ({
    _source: {
      uuid: `mock-${index}`,
      name: `Hackathon ${index + 1}`,
      tagline: `A great coding event focusing on innovation and technology.`,
      desc: 'Join us for an amazing hackathon experience!',
      slug: `hackathon-${index + 1}`,
      starts_at: new Date(Date.now() + 86400000 * (index + 5)).toISOString(),
      ends_at: new Date(Date.now() + 86400000 * (index + 7)).toISOString(),
      is_online: index % 2 === 0,
      city: index % 2 === 0 ? '' : 'San Francisco',
      state: index % 2 === 0 ? '' : 'California',
      country: index % 2 === 0 ? '' : 'USA',
      participants_count: 500 + index * 100,
      location: index % 2 === 0 ? 'Online' : 'San Francisco, USA',
      cover_img: `https://images.unsplash.com/photo-${1540304453 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`,
      hackathon_setting: {
        logo: `https://images.unsplash.com/photo-${1540304453 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80`,
        site: 'https://example.com',
        primary_color: '#0077FF',
        reg_starts_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        reg_ends_at: new Date(Date.now() + 86400000 * 2).toISOString(),
        women_only: false
      },
      prizes: [
        {
          uuid: `prize-${index}-1`,
          name: 'First Prize',
          desc: '$5000',
          is_sponsor_prize: false
        },
        {
          uuid: `prize-${index}-2`,
          name: 'Best hack built on Ethereum',
          desc: 'Winner of this track receives $100 in prizes from ETHIndia',
          is_sponsor_prize: true
        }
      ],
      sponsor_tiers: [
        {
          name: 'Gold Sponsors',
          sponsors: [
            {
              name: 'Tech Company',
              logo: 'https://via.placeholder.com/150',
              about: 'A leading tech company',
              uuid: `sponsor-${index}`
            }
          ],
          uuid: `tier-${index}`
        }
      ],
      status: 'publish',
      type: 'HACKATHON',
      team_min: 1,
      team_size: 4,
      themes: [
        {
          name: 'Sustainability Tech',
          uuid: `theme-${index}-1`
        },
        {
          name: 'Fintech',
          uuid: `theme-${index}-2`
        }
      ],
      apply_mode: 'both'
    }
  }));

  return {
    hits: {
      total: { value: mockHackathons.length },
      hits: mockHackathons
    }
  };
};

// Helper function to format a date to YYYY-MM-DD
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Get location coordinates from city, state, country
export const getLocationCoordinates = async (
  city: string,
  state: string,
  country: string
): Promise<GeoLocation | null> => {
  if (!city && !state && !country) {
    return null;
  }

  try {
    const searchTerm = [city, state, country].filter(Boolean).join(', ');
    const encodedSearch = encodeURIComponent(searchTerm);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedSearch}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Devfolio Hackathon Finder'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
};

// Memoization cache for coordinates to avoid repeated API calls
const coordinatesCache: Record<string, GeoLocation> = {};

// Get coordinates with caching
export const getCachedCoordinates = async (
  city: string,
  state: string,
  country: string
): Promise<GeoLocation | null> => {
  const cacheKey = `${city}|${state}|${country}`;
  
  // Return from cache if available
  if (coordinatesCache[cacheKey]) {
    return coordinatesCache[cacheKey];
  }
  
  // Fetch new coordinates
  const coordinates = await getLocationCoordinates(city, state, country);
  
  // Cache the result if found
  if (coordinates) {
    coordinatesCache[cacheKey] = coordinates;
  }
  
  return coordinates;
};

// Helper function to determine if a hackathon matches the provided filters
export const filterHackathons = (hackathons: DevfolioResponse, filters: HackathonFilters): DevfolioResponse => {
  if (!hackathons || !hackathons.hits || !hackathons.hits.hits) {
    return hackathons;
  }

  // Merge with default filters to ensure all fields are set
  const mergedFilters = { ...DEFAULT_FILTERS, ...filters };

  const filteredHits = hackathons.hits.hits.filter(hit => {
    const hackathon = hit._source;
    
    // Filter by search term
    if (mergedFilters.searchTerm && 
       !hackathon.name.toLowerCase().includes(mergedFilters.searchTerm.toLowerCase()) && 
       !hackathon.tagline.toLowerCase().includes(mergedFilters.searchTerm.toLowerCase()) &&
       !hackathon.desc.toLowerCase().includes(mergedFilters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by location type
    if (mergedFilters.location !== 'any') {
      if (mergedFilters.location === 'online' && !hackathon.is_online) {
        return false;
      }
      if (mergedFilters.location === 'in-person' && hackathon.is_online) {
        return false;
      }
    }
    
    // Filter by participation mode
    if (mergedFilters.participationMode && mergedFilters.participationMode !== 'any') {
      if (mergedFilters.participationMode === 'online' && !hackathon.is_online) {
        return false;
      }
      if (mergedFilters.participationMode === 'offline' && hackathon.is_online) {
        return false;
      }
      if (mergedFilters.participationMode === 'hybrid' && hackathon.apply_mode !== 'both') {
        return false;
      }
    }
    
    // Filter by country
    if (mergedFilters.country && hackathon.country !== mergedFilters.country) {
      return false;
    }
    
    // Filter by state
    if (mergedFilters.state && hackathon.state !== mergedFilters.state) {
      return false;
    }
    
    // Filter by city
    if (mergedFilters.city && hackathon.city !== mergedFilters.city) {
      return false;
    }
    
    // Filter by event type
    if (mergedFilters.eventType && hackathon.type !== mergedFilters.eventType) {
      return false;
    }
    
    // Filter by team size
    if (mergedFilters.teamSizeMin !== null && hackathon.team_min < mergedFilters.teamSizeMin) {
      return false;
    }
    
    if (mergedFilters.teamSizeMax !== null && hackathon.team_size > mergedFilters.teamSizeMax) {
      return false;
    }
    
    // Filter by prize name
    if (mergedFilters.prizeFilter) {
      const hasPrize = hackathon.prizes && hackathon.prizes.some(prize => 
        prize.name.toLowerCase().includes(mergedFilters.prizeFilter!.toLowerCase()) ||
        prize.desc.toLowerCase().includes(mergedFilters.prizeFilter!.toLowerCase())
      );
      if (!hasPrize) {
        return false;
      }
    }
    
    // Filter by themes
    if (mergedFilters.themeFilter && mergedFilters.themeFilter.length > 0) {
      if (!hackathon.themes || hackathon.themes.length === 0) {
        // Check if theme is in description for hackathons without explicit themes
        const themeInDesc = mergedFilters.themeFilter.some(theme => 
          hackathon.desc.toLowerCase().includes(theme.toLowerCase())
        );
        if (!themeInDesc) {
          return false;
        }
      } else {
        const hasTheme = mergedFilters.themeFilter.some(theme => 
          hackathon.themes.some(hackathonTheme => 
            hackathonTheme.name.toLowerCase().includes(theme.toLowerCase())
          )
        );
        if (!hasTheme) {
          return false;
        }
      }
    }
    
    // Filter by date range
    const startDate = new Date(hackathon.starts_at);
    const endDate = new Date(hackathon.ends_at);
    const today = new Date();
    
    if (mergedFilters.dateRange !== 'any') {
      // Custom date range
      if (mergedFilters.dateRange === 'custom') {
        if (mergedFilters.startDate && mergedFilters.endDate) {
          const filterStartDate = new Date(mergedFilters.startDate);
          const filterEndDate = new Date(mergedFilters.endDate);
          
          // Check if the hackathon dates overlap with the filter dates
          if (endDate < filterStartDate || startDate > filterEndDate) {
            return false;
          }
        }
      }
      // Next 7 days
      else if (mergedFilters.dateRange === 'upcoming') {
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        if (startDate > nextWeek || endDate < today) {
          return false;
        }
      }
      // This month
      else if (mergedFilters.dateRange === 'this-month') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        if (startDate > lastDayOfMonth || endDate < firstDayOfMonth) {
          return false;
        }
      }
      // Next month
      else if (mergedFilters.dateRange === 'next-month') {
        const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const lastDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        if (startDate > lastDayOfNextMonth || endDate < firstDayOfNextMonth) {
          return false;
        }
      }
      // Past hackathons
      else if (mergedFilters.dateRange === 'past') {
        if (endDate > today) {
          return false;
        }
      }
    }
    
    // Filter by registration status
    if (mergedFilters.registrationStatus !== 'any' && hackathon.hackathon_setting) {
      const regStartDate = new Date(hackathon.hackathon_setting.reg_starts_at);
      const regEndDate = new Date(hackathon.hackathon_setting.reg_ends_at);
      
      if (mergedFilters.registrationStatus === 'open') {
        if (today < regStartDate || today > regEndDate) {
          return false;
        }
      }
      
      if (mergedFilters.registrationStatus === 'closed') {
        if (today >= regStartDate && today <= regEndDate) {
          return false;
        }
      }
      
      // Custom registration date range
      if (mergedFilters.registrationStartDate && mergedFilters.registrationEndDate) {
        const filterRegStartDate = new Date(mergedFilters.registrationStartDate);
        const filterRegEndDate = new Date(mergedFilters.registrationEndDate);
        
        // Check if registration dates match the filter dates
        if (regStartDate.toISOString().split('T')[0] !== filterRegStartDate.toISOString().split('T')[0] ||
            regEndDate.toISOString().split('T')[0] !== filterRegEndDate.toISOString().split('T')[0]) {
          return false;
        }
      }
    }
    
    return true;
  });
  
  return {
    hits: {
      total: { value: filteredHits.length },
      hits: filteredHits
    }
  };
}; 