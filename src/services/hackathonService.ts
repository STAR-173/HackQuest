import { DevfolioResponse, HackathonFilters } from '../types/hackathon';

// Original API URL
const DEVFOLIO_API_URL = 'https://api.devfolio.co/api/search/hackathons';
// Local development proxy URL
const LOCAL_PROXY_URL = '/api/devfolio/api/search/hackathons';
// Fallback public CORS proxy
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export const fetchHackathons = async (
  filters: HackathonFilters,
  from = 0,
  size = 10
): Promise<DevfolioResponse> => {
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
    body: JSON.stringify({
      type: 'application_open',
      from,
      size,
      // Additional filters can be added here based on the HackathonFilters
    }),
  };

  // Try different approaches in sequence
  
  // First try: Local development proxy
  try {
    console.log('Attempting to fetch hackathons via local proxy...');
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
    console.log('Attempting to fetch hackathons via CORS proxy...');
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
      },
      prizes: [
        {
          uuid: `prize-${index}-1`,
          name: 'First Prize',
          desc: '$5000',
          is_sponsor_prize: false
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
      status: 'publish'
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

// Helper function to determine if a hackathon matches the provided filters
export const filterHackathons = (hackathons: DevfolioResponse, filters: HackathonFilters): DevfolioResponse => {
  if (!hackathons || !hackathons.hits || !hackathons.hits.hits) {
    return hackathons;
  }

  const filteredHits = hackathons.hits.hits.filter(hit => {
    const hackathon = hit._source;
    
    // Filter by search term
    if (filters.searchTerm && !hackathon.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !hackathon.tagline.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by location type
    if (filters.location !== 'any') {
      if (filters.location === 'online' && !hackathon.is_online) {
        return false;
      }
      if (filters.location === 'in-person' && hackathon.is_online) {
        return false;
      }
    }
    
    // Filter by date range
    const startDate = new Date(hackathon.starts_at);
    const endDate = new Date(hackathon.ends_at);
    const today = new Date();
    
    if (filters.dateRange !== 'any') {
      // Next 7 days
      if (filters.dateRange === 'upcoming') {
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        if (startDate > nextWeek || endDate < today) {
          return false;
        }
      }
      
      // This month
      else if (filters.dateRange === 'this-month') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        if (startDate > lastDayOfMonth || endDate < firstDayOfMonth) {
          return false;
        }
      }
      
      // Next month
      else if (filters.dateRange === 'next-month') {
        const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const lastDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        if (startDate > lastDayOfNextMonth || endDate < firstDayOfNextMonth) {
          return false;
        }
      }
      
      // Past hackathons
      else if (filters.dateRange === 'past') {
        if (endDate > today) {
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