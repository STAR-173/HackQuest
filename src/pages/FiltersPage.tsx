import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import { HackathonFilters } from "../types/hackathon";

const FiltersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get any existing filters from location state
  const existingFilters = location.state?.filters || {
    searchTerm: '',
    location: 'any',
    dateRange: 'any',
    technologies: []
  };
  
  const [filters, setFilters] = useState<HackathonFilters>(existingFilters);
  
  const technologies = [
    "AI", "Blockchain", "Web3", "Mobile", "IoT", 
    "AR/VR", "Cloud", "Data Science", "Cybersecurity", 
    "Game Dev", "FinTech", "Healthcare", "Education"
  ];

  const handleTechnologyToggle = (tech: string) => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech) 
        ? prev.technologies.filter(t => t !== tech) 
        : [...prev.technologies, tech]
    }));
  };
  
  const handleLocationChange = (locationValue: 'any' | 'in-person' | 'online') => {
    setFilters(prev => ({
      ...prev,
      location: locationValue
    }));
  };
  
  const handleDateRangeChange = (dateRange: 'any' | 'upcoming' | 'this-month' | 'next-month' | 'past') => {
    setFilters(prev => ({
      ...prev,
      dateRange
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      location: 'any', 
      dateRange: 'any',
      technologies: []
    });
  };
  
  const applyFilters = () => {
    // Navigate back to main page with the filters
    navigate('/', { state: { filters } });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-30" />
        <div className="container mx-auto flex items-center p-4 relative">
          <Link to="/" className="mr-4 hover:text-blue-200 transition-colors duration-300">
            <ArrowLeftIcon className="h-6 w-6" strokeWidth={1.5} />
          </Link>
          <h1 className="text-2xl tracking-wider">FILTER HACKATHONS</h1>
        </div>
        <div className="h-1 bg-gradient-to-r from-blue-800 to-blue-900" />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white border-2 border-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-10" />
          <div className="p-8 space-y-12 relative">
            <section>
              <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                DATE RANGE
              </h2>
              <div className="space-y-4">
                {[
                  ["any", "Any time"], 
                  ["upcoming", "Next 7 days"], 
                  ["this-month", "This month"], 
                  ["next-month", "Next month"], 
                  ["past", "Past hackathons"]
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center cursor-pointer group">
                    <input 
                      type="radio" 
                      name="dateRange" 
                      value={value} 
                      checked={filters.dateRange === value} 
                      onChange={() => handleDateRangeChange(value as any)} 
                      className="w-5 h-5 accent-blue-700" 
                    />
                    <span className="ml-3 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                LOCATION
              </h2>
              <div className="space-y-4">
                {[
                  ["any", "Any location"], 
                  ["in-person", "In-person only"], 
                  ["online", "Online only"]
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center cursor-pointer group">
                    <input 
                      type="radio" 
                      name="locationType" 
                      value={value} 
                      checked={filters.location === value} 
                      onChange={() => handleLocationChange(value as any)} 
                      className="w-5 h-5 accent-blue-700" 
                    />
                    <span className="ml-3 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                TECHNOLOGIES
              </h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map(tech => (
                  <button 
                    key={tech} 
                    onClick={() => handleTechnologyToggle(tech)} 
                    className={`px-4 py-2 text-sm tracking-wider relative overflow-hidden group
                      ${filters.technologies.includes(tech) ? "bg-blue-700 text-white" : "bg-white text-blue-800 border-2 border-blue-800 hover:bg-blue-50"} transition-colors duration-300`}
                  >
                    <span className="relative z-10">{tech}</span>
                    {filters.technologies.includes(tech) && (
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-30" />
                    )}
                  </button>
                ))}
              </div>
            </section>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={clearFilters} 
                className="flex-1 border-2 border-blue-800 text-blue-800 py-3 tracking-wider hover:bg-blue-50 transition-colors duration-300 flex justify-center items-center gap-2"
              >
                <XIcon className="h-5 w-5" strokeWidth={1.5} />
                CLEAR ALL
              </button>
              <button 
                onClick={applyFilters} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 tracking-wider relative overflow-hidden group"
              >
                <span className="relative z-10">APPLY FILTERS</span>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FiltersPage;