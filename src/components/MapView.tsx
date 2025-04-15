
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EmergencyRequest, Ambulance } from '@/types';
import AiService from '@/services/AiService';

// Fix for default marker icons in Leaflet with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom ambulance icon
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2180/2180437.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Custom emergency icon
const emergencyIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/4378/4378050.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  emergencyRequests?: EmergencyRequest[];
  ambulances?: Ambulance[];
  selectedEmergencyId?: string | null;
  selectedAmbulanceId?: string | null;
}

const MapView: React.FC<MapViewProps> = ({ 
  latitude, 
  longitude, 
  zoom = 11,
  emergencyRequests = [],
  ambulances = [],
  selectedEmergencyId = null,
  selectedAmbulanceId = null
}) => {
  // GraphHopper API key for routing if needed
  const graphhopperApiKey = AiService.getGraphhopperApiKey();
  const centerPosition: [number, number] = [latitude, longitude];
  
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={centerPosition}
        zoom={zoom} 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render Emergency Markers */}
        {emergencyRequests.map(request => {
          const isSelected = selectedEmergencyId === request.id;
          const requestPosition: [number, number] = [
            request.location.coordinates.latitude, 
            request.location.coordinates.longitude
          ];
          
          return (
            <Marker 
              key={request.id}
              position={requestPosition}
              icon={emergencyIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{request.name}</h3>
                  <p className="text-sm">{request.location.address}</p>
                  <p className="text-xs mt-1">Status: {request.status}</p>
                  {request.notes && <p className="text-xs mt-1">Notes: {request.notes}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Render Ambulance Markers */}
        {ambulances.filter(amb => amb.lastLocation).map(ambulance => {
          const isSelected = selectedAmbulanceId === ambulance.id;
          const ambulancePosition: [number, number] = [
            ambulance.lastLocation!.latitude, 
            ambulance.lastLocation!.longitude
          ];
          
          return (
            <Marker 
              key={ambulance.id}
              position={ambulancePosition}
              icon={ambulanceIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{ambulance.name}</h3>
                  <p className="text-sm">{ambulance.vehicleNumber}</p>
                  <p className="text-xs mt-1">Driver: {ambulance.driver.name}</p>
                  <p className="text-xs">Status: {ambulance.status}</p>
                  {ambulance.lastLocation && (
                    <p className="text-xs mt-1">
                      Last updated: {new Date(ambulance.lastLocation.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
