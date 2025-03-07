import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HackathonData } from "../types/hackathon";
import L from "leaflet";

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
  // Filter out online hackathons and hackathons without location data for the map view
  const inPersonHackathons = hackathons.filter(hackathon => 
    !hackathon.is_online && hackathon.country);

  // Get coordinates for each location (simplified approach - would ideally use a geocoding service)
  const hackathonsWithCoordinates: HackathonWithCoordinates[] = inPersonHackathons.map(hackathon => {
    // This is a very simplified approach to generating coordinates
    // In a real application, you would use a geocoding service or store actual coordinates
    const randomLat = Math.random() * 180 - 90;
    const randomLng = Math.random() * 360 - 180;
    
    return {
      ...hackathon,
      coordinates: [randomLat, randomLng] as [number, number]
    };
  });

  // Default center position
  const defaultCenter: [number, number] = [20, 0]; // Roughly the center of the world map
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full h-[calc(100vh-350px)] border-4 border-blue-700">
      <MapContainer 
        center={defaultCenter}
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