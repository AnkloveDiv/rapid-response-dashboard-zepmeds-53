
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EmergencyRequest, Ambulance } from '@/types';
import EmergencyMarker from './map/EmergencyMarker';
import AmbulanceMarker from './map/AmbulanceMarker';

// Use a valid public Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const emergencyMarkers = useRef<{ [key: string]: EmergencyMarker }>({});
  const ambulanceMarkers = useRef<{ [key: string]: AmbulanceMarker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
        essential: true
      });
    }
  }, [latitude, longitude, zoom]);

  // Add emergency request markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove old markers
    Object.values(emergencyMarkers.current).forEach(marker => marker.remove());
    emergencyMarkers.current = {};

    // Add new markers
    emergencyRequests.forEach(request => {
      try {
        emergencyMarkers.current[request.id] = new EmergencyMarker(
          request, 
          selectedEmergencyId === request.id, 
          map.current!
        );
      } catch (error) {
        console.error(`Error creating marker for emergency ${request.id}:`, error);
      }
    });

    return () => {
      Object.values(emergencyMarkers.current).forEach(marker => marker.remove());
    };
  }, [mapLoaded, emergencyRequests, selectedEmergencyId]);

  // Add ambulance markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove old markers
    Object.values(ambulanceMarkers.current).forEach(marker => marker.remove());
    ambulanceMarkers.current = {};

    // Add new markers
    ambulances.forEach(ambulance => {
      if (!ambulance.lastLocation) return;
      
      try {
        ambulanceMarkers.current[ambulance.id] = new AmbulanceMarker(
          ambulance, 
          selectedAmbulanceId === ambulance.id,
          map.current!
        );
      } catch (error) {
        console.error(`Error creating marker for ambulance ${ambulance.id}:`, error);
      }
    });

    return () => {
      Object.values(ambulanceMarkers.current).forEach(marker => marker.remove());
    };
  }, [mapLoaded, ambulances, selectedAmbulanceId]);

  return <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />;
};

export default MapView;
