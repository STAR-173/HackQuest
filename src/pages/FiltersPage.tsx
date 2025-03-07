import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { HackathonFilters } from "../types/hackathon";
import { DEFAULT_FILTERS } from "../services/hackathonService";

const FiltersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get any existing filters from location state or use defaults
  const existingFilters = location.state?.filters || DEFAULT_FILTERS;
  
  const [filters, setFilters] = useState<HackathonFilters>(existingFilters);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [teamSizeOpen, setTeamSizeOpen] = useState(false);
  const [prizesOpen, setPrizesOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  
  const technologies = [
    "AI", "Blockchain", "Web3", "Mobile", "IoT", 
    "AR/VR", "Cloud", "Data Science", "Cybersecurity", 
    "Game Dev", "FinTech", "Healthcare", "Education"
  ];

  const themes = [
    "Sustainability Tech", "Fintech", "Health Tech", "Open Innovations",
    "Web3", "AI/ML", "Blockchain", "Metaverse", "Gaming"
  ];

  const countries = ["India", "USA", "Malaysia", "Singapore", "Other"];
  const indianStates = ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Kerala", "Telangana"];
  const cities = ["Mumbai", "Bangalore", "Navi Mumbai", "Chennai", "Delhi", "Pune", "Kuzhuppilly"];

  const prizes = [
    "Best hack built on Ethereum", 
    "Grand Prize", 
    "First Runner-Up", 
    "Second Runner-Up"
  ];

  const handleTechnologyToggle = (tech: string) => {
    setFilters(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech) 
        ? prev.technologies.filter(t => t !== tech) 
        : [...prev.technologies, tech]
    }));
  };
  
  const handleThemeToggle = (theme: string) => {
    setFilters(prev => {
      const newThemes = prev.themeFilter || [];
      return {
        ...prev,
        themeFilter: newThemes.includes(theme)
          ? newThemes.filter(t => t !== theme)
          : [...newThemes, theme]
      };
    });
  };
  
  const handleLocationChange = (locationValue: 'any' | 'in-person' | 'online') => {
    setFilters(prev => ({
      ...prev,
      location: locationValue
    }));
  };
  
  const handleDateRangeChange = (dateRange: 'any' | 'upcoming' | 'this-month' | 'next-month' | 'past' | 'custom') => {
    setFilters(prev => ({
      ...prev,
      dateRange
    }));
  };

  const handleParticipationModeChange = (mode: 'any' | 'online' | 'offline' | 'hybrid') => {
    setFilters(prev => ({
      ...prev,
      participationMode: mode
    }));
  };

  const handleRegistrationStatusChange = (status: 'any' | 'open' | 'closed') => {
    setFilters(prev => ({
      ...prev,
      registrationStatus: status
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'null' ? null : e.target.value;
    setFilters(prev => ({
      ...prev,
      country: value
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'null' ? null : e.target.value;
    setFilters(prev => ({
      ...prev,
      state: value
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'null' ? null : e.target.value;
    setFilters(prev => ({
      ...prev,
      city: value
    }));
  };

  const handlePrizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'null' ? null : e.target.value;
    setFilters(prev => ({
      ...prev,
      prizeFilter: value
    }));
  };

  const handleTeamSizeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({
      ...prev,
      teamSizeMin: value
    }));
  };

  const handleTeamSizeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setFilters(prev => ({
      ...prev,
      teamSizeMax: value
    }));
  };

  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'null' ? null : e.target.value;
    setFilters(prev => ({
      ...prev,
      eventType: value
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || null;
    setFilters(prev => ({
      ...prev,
      startDate: value
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || null;
    setFilters(prev => ({
      ...prev,
      endDate: value
    }));
  };

  const handleRegistrationStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || null;
    setFilters(prev => ({
      ...prev,
      registrationStartDate: value
    }));
  };

  const handleRegistrationEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || null;
    setFilters(prev => ({
      ...prev,
      registrationEndDate: value
    }));
  };
  
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
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
          <div className="p-8 space-y-8 relative">
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
                  ["past", "Past hackathons"],
                  ["custom", "Custom date range"]
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

                {filters.dateRange === 'custom' && (
                  <div className="mt-4 pl-8 space-y-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-blue-800">Start Date:</label>
                      <input 
                        type="date"
                        value={filters.startDate || ''}
                        onChange={handleStartDateChange}
                        className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-blue-800">End Date:</label>
                      <input 
                        type="date"
                        value={filters.endDate || ''}
                        onChange={handleEndDateChange}
                        className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
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

              <button 
                onClick={() => setLocationOpen(!locationOpen)}
                className="mt-4 text-blue-700 flex items-center font-medium hover:text-blue-500"
              >
                {locationOpen ? (
                  <ChevronUpIcon className="h-5 w-5 mr-1" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 mr-1" />
                )}
                Advanced Location Options
              </button>

              {locationOpen && (
                <div className="mt-4 space-y-4 p-4 bg-blue-50 rounded-md">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm text-blue-800">Country:</label>
                    <select 
                      value={filters.country || 'null'} 
                      onChange={handleCountryChange}
                      className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                    >
                      <option value="null">Any Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {filters.country === 'India' && (
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm text-blue-800">State:</label>
                      <select 
                        value={filters.state || 'null'} 
                        onChange={handleStateChange}
                        className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                      >
                        <option value="null">Any State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm text-blue-800">City:</label>
                    <select 
                      value={filters.city || 'null'} 
                      onChange={handleCityChange}
                      className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                    >
                      <option value="null">Any City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                PARTICIPATION MODE
              </h2>
              <div className="space-y-4">
                {[
                  ["any", "Any participation mode"],
                  ["online", "Online only"],
                  ["offline", "Offline only"],
                  ["hybrid", "Hybrid (both online & offline)"]
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center cursor-pointer group">
                    <input 
                      type="radio" 
                      name="participationMode" 
                      value={value} 
                      checked={filters.participationMode === value} 
                      onChange={() => handleParticipationModeChange(value as any)} 
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
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                  EVENT TYPE
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <select 
                    value={filters.eventType || 'null'} 
                    onChange={handleEventTypeChange}
                    className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                  >
                    <option value="null">Any Event Type</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="CONFERENCE">Conference</option>
                    <option value="WORKSHOP">Workshop</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                  TEAM SIZE
                </h2>
                <button 
                  onClick={() => setTeamSizeOpen(!teamSizeOpen)}
                  className="text-blue-700 mb-6 flex items-center font-medium hover:text-blue-500"
                >
                  {teamSizeOpen ? (
                    <ChevronUpIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 mr-1" />
                  )}
                </button>
              </div>
              {teamSizeOpen && (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1 flex flex-col">
                      <label className="mb-1 text-sm text-blue-800">Min Team Size:</label>
                      <input 
                        type="number"
                        min="1"
                        value={filters.teamSizeMin || ''}
                        onChange={handleTeamSizeMinChange}
                        className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="mb-1 text-sm text-blue-800">Max Team Size:</label>
                      <input 
                        type="number"
                        min="1"
                        value={filters.teamSizeMax || ''}
                        onChange={handleTeamSizeMaxChange}
                        className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                  PRIZES
                </h2>
                <button 
                  onClick={() => setPrizesOpen(!prizesOpen)}
                  className="text-blue-700 mb-6 flex items-center font-medium hover:text-blue-500"
                >
                  {prizesOpen ? (
                    <ChevronUpIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 mr-1" />
                  )}
                </button>
              </div>
              {prizesOpen && (
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm text-blue-800">Prize Type:</label>
                    <select 
                      value={filters.prizeFilter || 'null'} 
                      onChange={handlePrizeChange}
                      className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                    >
                      <option value="null">Any Prize</option>
                      {prizes.map(prize => (
                        <option key={prize} value={prize}>{prize}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                  THEMES
                </h2>
                <button 
                  onClick={() => setThemesOpen(!themesOpen)}
                  className="text-blue-700 mb-6 flex items-center font-medium hover:text-blue-500"
                >
                  {themesOpen ? (
                    <ChevronUpIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 mr-1" />
                  )}
                </button>
              </div>
              {themesOpen && (
                <div className="flex flex-wrap gap-3">
                  {themes.map(theme => (
                    <button 
                      key={theme} 
                      onClick={() => handleThemeToggle(theme)} 
                      className={`px-4 py-2 text-sm tracking-wider relative overflow-hidden group
                        ${filters.themeFilter?.includes(theme) 
                          ? "bg-blue-700 text-white" 
                          : "bg-white text-blue-800 border-2 border-blue-800 hover:bg-blue-50"} 
                        transition-colors duration-300`}
                    >
                      <span className="relative z-10">{theme}</span>
                      {filters.themeFilter?.includes(theme) && (
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-30" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-blue-900 mb-6 pb-2 border-b-2 border-blue-100 tracking-wider">
                  REGISTRATION
                </h2>
                <button 
                  onClick={() => setRegistrationOpen(!registrationOpen)}
                  className="text-blue-700 mb-6 flex items-center font-medium hover:text-blue-500"
                >
                  {registrationOpen ? (
                    <ChevronUpIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 mr-1" />
                  )}
                </button>
              </div>
              {registrationOpen && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {[
                      ["any", "Any status"],
                      ["open", "Registration open"],
                      ["closed", "Registration closed"]
                    ].map(([value, label]) => (
                      <label key={value} className="flex items-center cursor-pointer group">
                        <input 
                          type="radio" 
                          name="registrationStatus" 
                          value={value} 
                          checked={filters.registrationStatus === value} 
                          onChange={() => handleRegistrationStatusChange(value as any)} 
                          className="w-5 h-5 accent-blue-700" 
                        />
                        <span className="ml-3 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {filters.registrationStatus !== 'any' && (
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm text-blue-800">Registration Start Date:</label>
                        <input 
                          type="date"
                          value={filters.registrationStartDate || ''}
                          onChange={handleRegistrationStartDateChange}
                          className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm text-blue-800">Registration End Date:</label>
                        <input 
                          type="date"
                          value={filters.registrationEndDate || ''}
                          onChange={handleRegistrationEndDateChange}
                          className="border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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