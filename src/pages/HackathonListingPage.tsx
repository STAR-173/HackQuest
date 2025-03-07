import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import HackathonCard from "../components/HackathonCard";
import ToggleSwitch from "../components/ToggleSwitch";
import MapView from "../components/MapView";
import { DevfolioResponse, HackathonData, HackathonFilters } from "../types/hackathon";
import { fetchHackathons, filterHackathons, DEFAULT_FILTERS } from "../services/hackathonService";
import { FilterIcon, RefreshCw, CalendarIcon, MapPinIcon, UsersIcon, AwardIcon, TagIcon } from "lucide-react";

const HackathonListingPage = () => {
  const location = useLocation();
  const [isMapView, setIsMapView] = useState(false);
  const [hackathons, setHackathons] = useState<HackathonData[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<HackathonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  
  // Initialize filters from location state or with defaults
  const [filters, setFilters] = useState<HackathonFilters>(
    location.state?.filters || DEFAULT_FILTERS
  );

  // Update filters when location state changes
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setPage(0); // Reset to first page when filters change
    }
  }, [location.state]);

  // Fetch hackathons from API
  const getHackathons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchHackathons(filters, page * filters.pageSize, filters.pageSize);
      
      // Check if we got mock data due to API failure
      if (response.hits.hits.length > 0 && response.hits.hits[0]._source.uuid.startsWith('mock-')) {
        setUseMockData(true);
      } else {
        setUseMockData(false);
      }
      
      if (page === 0) {
        setHackathons(response.hits.hits.map(hit => hit._source));
      } else {
        setHackathons(prevHackathons => [
          ...prevHackathons,
          ...response.hits.hits.map(hit => hit._source)
        ]);
      }
      
      setHasMore(response.hits.hits.length === filters.pageSize);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError('Failed to fetch hackathons from the API. This may be due to CORS restrictions or network issues.');
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    getHackathons();
  }, [page, filters]);

  // Apply filters to hackathons
  useEffect(() => {
    if (hackathons.length > 0) {
      // For client-side filtering, create a DevfolioResponse object
      const mockResponse: DevfolioResponse = {
        hits: {
          total: { value: hackathons.length },
          hits: hackathons.map(hackathon => ({ _source: hackathon }))
        }
      };
      
      const filtered = filterHackathons(mockResponse, filters);
      setFilteredHackathons(filtered.hits.hits.map(hit => hit._source));
    } else {
      setFilteredHackathons([]);
    }
  }, [hackathons, filters]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    setPage(0); // Reset to first page when search term changes
  };

  // Handle location filter change
  const handleLocationChange = (location: 'any' | 'in-person' | 'online') => {
    setFilters(prev => ({ ...prev, location }));
    setPage(0); // Reset to first page when location changes
  };

  // Handle date range filter change
  const handleDateRangeChange = (dateRange: 'any' | 'upcoming' | 'this-month' | 'next-month' | 'past') => {
    setFilters(prev => ({ ...prev, dateRange }));
    setPage(0); // Reset to first page when date range changes
  };

  // Load more hackathons
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  // Retry fetching hackathons
  const handleRetry = () => {
    setPage(0);
    getHackathons();
  };

  // Check if any filters are active
  const isFiltersActive = 
    filters.searchTerm !== '' || 
    filters.location !== 'any' || 
    filters.dateRange !== 'any' || 
    filters.technologies.length > 0 ||
    filters.country !== null ||
    filters.state !== null ||
    filters.city !== null ||
    filters.eventType !== null ||
    filters.startDate !== null ||
    filters.endDate !== null ||
    filters.teamSizeMin !== null ||
    filters.teamSizeMax !== null ||
    filters.participationMode !== null ||
    filters.prizeFilter !== null ||
    (filters.themeFilter !== null && filters.themeFilter.length > 0) ||
    filters.registrationStatus !== 'any';

  // Count active filter categories
  const countActiveFilterCategories = () => {
    let count = 0;
    
    // Basic filters
    if (filters.location !== 'any') count++;
    if (filters.dateRange !== 'any') count++;
    if (filters.technologies.length > 0) count++;
    
    // Advanced location filters
    if (filters.country !== null || filters.state !== null || filters.city !== null) count++;
    
    // Event type
    if (filters.eventType !== null) count++;
    
    // Custom date range
    if (filters.startDate !== null || filters.endDate !== null) count++;
    
    // Team size
    if (filters.teamSizeMin !== null || filters.teamSizeMax !== null) count++;
    
    // Participation mode
    if (filters.participationMode !== null) count++;
    
    // Prize filter
    if (filters.prizeFilter !== null) count++;
    
    // Theme filter
    if (filters.themeFilter !== null && filters.themeFilter.length > 0) count++;
    
    // Registration status
    if (filters.registrationStatus !== 'any') count++;
    
    return count;
  };

  // Get active filter tags to display
  const getActiveFilterTags = () => {
    const tags = [];
    
    // Location filters
    if (filters.location !== 'any' || filters.country || filters.state || filters.city) {
      const locationText = 
        filters.city ? filters.city :
        filters.state ? filters.state :
        filters.country ? filters.country :
        filters.location === 'in-person' ? 'In-person' : 'Online';
      
      tags.push({
        icon: <MapPinIcon className="h-3.5 w-3.5 mr-1" />,
        text: locationText
      });
    }
    
    // Date filters
    if (filters.dateRange !== 'any' || filters.startDate || filters.endDate) {
      let dateText = '';
      
      if (filters.startDate && filters.endDate) {
        dateText = `${filters.startDate} to ${filters.endDate}`;
      } else if (filters.dateRange === 'upcoming') {
        dateText = 'Next 7 days';
      } else if (filters.dateRange === 'this-month') {
        dateText = 'This month';
      } else if (filters.dateRange === 'next-month') {
        dateText = 'Next month';
      } else if (filters.dateRange === 'past') {
        dateText = 'Past';
      }
      
      tags.push({
        icon: <CalendarIcon className="h-3.5 w-3.5 mr-1" />,
        text: dateText
      });
    }
    
    // Team size filters
    if (filters.teamSizeMin !== null || filters.teamSizeMax !== null) {
      let teamText = 'Team size: ';
      
      if (filters.teamSizeMin !== null && filters.teamSizeMax !== null) {
        teamText += `${filters.teamSizeMin}-${filters.teamSizeMax}`;
      } else if (filters.teamSizeMin !== null) {
        teamText += `Min ${filters.teamSizeMin}`;
      } else if (filters.teamSizeMax !== null) {
        teamText += `Max ${filters.teamSizeMax}`;
      }
      
      tags.push({
        icon: <UsersIcon className="h-3.5 w-3.5 mr-1" />,
        text: teamText
      });
    }
    
    // Prize filter
    if (filters.prizeFilter) {
      tags.push({
        icon: <AwardIcon className="h-3.5 w-3.5 mr-1" />,
        text: filters.prizeFilter
      });
    }
    
    // Theme filters
    if (filters.themeFilter && filters.themeFilter.length > 0) {
      tags.push({
        icon: <TagIcon className="h-3.5 w-3.5 mr-1" />,
        text: `${filters.themeFilter.length} themes`
      });
    }
    
    return tags;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl text-blue-900 mb-2 text-center tracking-wider">
          UPCOMING HACKATHONS
        </h1>
        <p className="text-blue-600 text-center mb-8 tracking-wide">
          Discover your next coding adventure
        </p>
        
        {/* Search and Filter Section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="bg-white p-4 border-2 border-blue-800 h-full">
                <input
                  type="text"
                  placeholder="Search hackathons..."
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-2 border-2 border-blue-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <Link 
              to="/filters" 
              state={{ filters }}
              className="bg-white p-4 border-2 border-blue-800 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <FilterIcon className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-bold">
                {isFiltersActive ? 'FILTERS ACTIVE' : 'FILTERS'}
              </span>
              {isFiltersActive && (
                <span className="bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {countActiveFilterCategories()}
                </span>
              )}
            </Link>
          </div>
          
          {/* Active filter tags */}
          {isFiltersActive && getActiveFilterTags().length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {getActiveFilterTags().map((tag, index) => (
                <div 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 text-xs flex items-center rounded-full"
                >
                  {tag.icon}
                  <span>{tag.text}</span>
                </div>
              ))}
              
              <Link 
                to="/filters" 
                state={{ filters }}
                className="bg-blue-700 text-white px-3 py-1 text-xs flex items-center rounded-full hover:bg-blue-800 transition-colors"
              >
                + More Filters
              </Link>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 border-2 border-blue-800">
              <h3 className="font-bold mb-2 text-blue-900">Location</h3>
              <div className="space-y-2">
                {[
                  { value: 'any', label: 'Any Location' },
                  { value: 'in-person', label: 'In-Person Only' },
                  { value: 'online', label: 'Online Only' }
                ].map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      checked={filters.location === option.value}
                      onChange={() => handleLocationChange(option.value as any)}
                      className="mr-2 accent-blue-700"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 border-2 border-blue-800">
              <h3 className="font-bold mb-2 text-blue-900">Date Range</h3>
              <div className="space-y-2">
                {[
                  { value: 'any', label: 'Any Time' },
                  { value: 'upcoming', label: 'Next 7 Days' },
                  { value: 'this-month', label: 'This Month' },
                  { value: 'next-month', label: 'Next Month' },
                  { value: 'past', label: 'Past Hackathons' }
                ].map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange"
                      checked={filters.dateRange === option.value}
                      onChange={() => handleDateRangeChange(option.value as any)}
                      className="mr-2 accent-blue-700"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 border-2 border-blue-800">
              <h3 className="font-bold mb-2 text-blue-900">View</h3>
              <ToggleSwitch isMapView={isMapView} toggleView={() => setIsMapView(!isMapView)} />
            </div>
          </div>
        </div>
        
        {/* Mock data notification */}
        {useMockData && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="ml-3">
                <p className="font-medium">Note: Using mock data</p>
                <p className="text-sm mt-1">
                  We're currently showing mock hackathon data due to API access issues. 
                  This is likely caused by CORS restrictions in your browser.
                </p>
                <button 
                  onClick={handleRetry} 
                  className="mt-2 flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
                >
                  <RefreshCw className="h-4 w-4 mr-1" strokeWidth={2} />
                  Try again with real data
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && page === 0 ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex">
              <div className="ml-3">
                <p className="font-medium">Error loading hackathons</p>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={handleRetry} 
                  className="mt-2 flex items-center text-sm font-medium text-red-800 hover:text-red-900"
                >
                  <RefreshCw className="h-4 w-4 mr-1" strokeWidth={2} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : filteredHackathons.length === 0 ? (
          <div className="text-center my-12">
            <p className="text-xl text-blue-900">No hackathons found matching your criteria.</p>
          </div>
        ) : isMapView ? (
          <div className="border-2 border-blue-800">
            <MapView hackathons={filteredHackathons} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHackathons.map(hackathon => (
                <HackathonCard key={hackathon.uuid} hackathon={hackathon} />
              ))}
            </div>
            
            {isLoading && page > 0 && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            )}
            
            {hasMore && !isLoading && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={loadMore}
                  className="bg-blue-700 text-white px-6 py-2 font-mono tracking-wider hover:bg-blue-800 transition-colors"
                >
                  LOAD MORE
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-6 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-30" />
        <p className="tracking-wider text-sm relative">
          HACKQUEST &copy; {new Date().getFullYear()} | FIND YOUR NEXT CODING ADVENTURE
        </p>
      </footer>
    </div>
  );
};

export default HackathonListingPage;