import React from "react";
import { CalendarIcon, MapPinIcon, UsersIcon, GlobeIcon } from "lucide-react";
import { HackathonData } from "../types/hackathon";

interface HackathonCardProps {
  hackathon: HackathonData;
}

const HackathonCard = ({
  hackathon
}: HackathonCardProps) => {
  // Format date strings to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="group bg-white relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,128,255,0.15)]">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <img 
          src={hackathon.cover_img || 'https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'} 
          alt={hackathon.name} 
          className="w-full h-48 object-cover filter saturate-[0.9]" 
        />
        <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-blue-700 text-white px-3 py-1">
          <span className="font-mono text-sm tracking-wider">
            {hackathon.is_online ? "ONLINE" : "IN-PERSON"}
          </span>
        </div>
      </div>
      <div className="p-6 border-x-2 border-b-2 border-blue-800">
        <div className="mb-4">
          <h2 className="font-mono text-xl text-blue-900 mb-2 leading-tight">
            {hackathon.name}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {hackathon.tagline}
          </p>
        </div>
        <div className="space-y-2 font-mono text-sm mb-4">
          <div className="flex items-center text-blue-800">
            <CalendarIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
            <span className="tracking-wide">
              {formatDate(hackathon.starts_at)} - {formatDate(hackathon.ends_at)}
            </span>
          </div>
          <div className="flex items-center text-blue-800">
            {hackathon.is_online ? (
              <GlobeIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
            ) : (
              <MapPinIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
            )}
            <span className="tracking-wide">
              {hackathon.location || (hackathon.city && hackathon.country 
                ? `${hackathon.city}, ${hackathon.country}` 
                : 'Location not specified')}
            </span>
          </div>
          <div className="flex items-center text-blue-800">
            <UsersIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
            <span className="tracking-wide">
              {hackathon.participants_count} participants
            </span>
          </div>
        </div>
        <a 
          href={hackathon.hackathon_setting?.site || `https://devfolio.co/hackathons/${hackathon.slug}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 font-mono tracking-wider text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 relative overflow-hidden group text-center"
        >
          <span className="relative z-10">VIEW DETAILS</span>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>
    </div>
  );
};

export default HackathonCard;