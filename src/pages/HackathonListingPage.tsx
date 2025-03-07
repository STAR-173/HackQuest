import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../components/Header";
import HackathonCard from "../components/HackathonCard";
import ToggleSwitch from "../components/ToggleSwitch";
import MapView from "../components/MapView";
import { DevfolioResponse, HackathonData, HackathonFilters } from "../types/hackathon";
import { fetchHackathons, filterHackathons } from "../services/hackathonService";
import { FilterIcon, RefreshCw } from "lucide-react";

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
    location.state?.filters || {
      searchTerm: '',
      location: 'any',
      dateRange: 'any',
      technologies: []
    }
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
      
      const response = await fetchHackathons(filters, page * 10, 10);
      
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
      
      setHasMore(response.hits.hits.length === 10);
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
    filters.technologies.length > 0;

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
                  {(filters.location !== 'any' ? 1 : 0) + 
                   (filters.dateRange !== 'any' ? 1 : 0) + 
                   (filters.technologies.length > 0 ? 1 : 0)}
                </span>
              )}
            </Link>
          </div>
          
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