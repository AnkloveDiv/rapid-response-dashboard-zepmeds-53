
import React from 'react';
import { EmergencyRequest, Ambulance } from '@/types';

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
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div 
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: '0.5rem',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '1rem',
          textAlign: 'center'
        }}
      >
        <div className="bg-purple-100 text-purple-800 rounded-full p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Map View Placeholder</h3>
        <p className="text-sm text-gray-500 mb-4">
          Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
        <div className="text-xs text-gray-400">
          {emergencyRequests.length} emergency requests and {ambulances.length} ambulances in this area
        </div>
      </div>
    </div>
  );
};

export default MapView;
