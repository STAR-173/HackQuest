import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HackathonData } from "../types/hackathon";
import L from "leaflet";
import { getCachedCoordinates } from "../services/hackathonService";

// Fix for default marker icons in react-leaflet
// Need to import images directly for markers to work in production
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";

const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapViewProps {
  hackathons: HackathonData[];
}

// Extend HackathonData with coordinates
interface HackathonWithCoordinates extends HackathonData {
  coordinates: [number, number];
}

const MapView = ({
  hackathons
}: MapViewProps) => {
  const [hackathonsWithCoordinates, setHackathonsWithCoordinates] = useState<HackathonWithCoordinates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);

  // Load coordinates for all hackathons
  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsLoading(true);
      
      // Filter out online hackathons and hackathons without location data
      const inPersonHackathons = hackathons.filter(hackathon => 
        !hackathon.is_online && (hackathon.country || hackathon.city || hackathon.state || hackathon.location)
      );
      
      const withCoordinates: HackathonWithCoordinates[] = [];
      
      for (const hackathon of inPersonHackathons) {
        try {
          // Try to get coordinates from location data
          let coordinates = await getCachedCoordinates(
            hackathon.city || '', 
            hackathon.state || '', 
            hackathon.country || ''
          );
          
          // If no coordinates found from city/state/country, try using the location field
          if (!coordinates && hackathon.location) {
            coordinates = await getCachedCoordinates('', '', hackathon.location);
          }
          
          // If we found coordinates, add them to the array
          if (coordinates) {
            withCoordinates.push({
              ...hackathon,
              coordinates: [coordinates.lat, coordinates.lng]
            });
          }
        } catch (error) {
          console.error(`Error getting coordinates for ${hackathon.name}:`, error);
        }
      }
      
      // Set default center based on available hackathons
      if (withCoordinates.length > 0) {
        // Calculate average position as center
        const sumLat = withCoordinates.reduce((sum, h) => sum + h.coordinates[0], 0);
        const sumLng = withCoordinates.reduce((sum, h) => sum + h.coordinates[1], 0);
        
        setMapCenter([
          sumLat / withCoordinates.length,
          sumLng / withCoordinates.length
        ]);
      }
      
      setHackathonsWithCoordinates(withCoordinates);
      setIsLoading(false);
    };

    fetchCoordinates();
  }, [hackathons]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-350px)] border-4 border-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (hackathonsWithCoordinates.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-350px)] border-4 border-blue-700 flex items-center justify-center">
        <p className="text-blue-700 text-lg font-medium">No in-person hackathons with location data found.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-350px)] border-4 border-blue-700">
      <MapContainer 
        center={mapCenter}
        zoom={2} 
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        />
        
        {hackathonsWithCoordinates.map(hackathon => (
          <Marker 
            key={hackathon.uuid} 
            position={hackathon.coordinates}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-blue-700">{hackathon.name}</h3>
                <p className="text-sm">{hackathon.location || `${hackathon.city}, ${hackathon.country}`}</p>
                <p className="text-xs">
                  {formatDate(hackathon.starts_at)} - {formatDate(hackathon.ends_at)}
                </p>
                <a 
                  href={hackathon.hackathon_setting?.site || `https://devfolio.co/hackathons/${hackathon.slug}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="mt-2 bg-blue-700 text-white text-xs px-2 py-1 font-bold inline-block"
                >
                  VIEW DETAILS
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;