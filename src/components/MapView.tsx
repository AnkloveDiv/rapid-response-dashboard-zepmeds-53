
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { EmergencyRequest, Ambulance } from '@/types';

// Temporary public token - In production, this would come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1hY2NvdW50LXplcG1lZHMiLCJhIjoiY2tlMHpxYXJpMGI3YjJ6cnZ5N21janF3YSJ9.D2YGJDvj6kRhPpQ1NXvr7A';
mapboxgl.accessToken = MAPBOX_TOKEN;

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
  const emergencyMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const ambulanceMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});
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
      const { latitude, longitude } = request.location.coordinates;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'flex items-center justify-center';
      el.style.width = '30px';
      el.style.height = '30px';

      // Create inner pin element
      const pin = document.createElement('div');
      pin.className = 'relative';
      
      // Style based on status and selection
      const isSelected = selectedEmergencyId === request.id;
      const color = request.status === 'pending' ? '#f97316' : '#3b82f6';
      
      pin.innerHTML = `
        <svg viewBox="0 0 24 24" width="${isSelected ? '30' : '24'}" height="${isSelected ? '30' : '24'}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21C16.4183 17 20 13.4183 20 10C20 6.13401 16.4183 3 12 3C7.58172 3 4 6.13401 4 10C4 13.4183 7.58172 17 12 21Z" fill="${color}" stroke="${isSelected ? '#000' : color}" stroke-width="2"/>
          <circle cx="12" cy="10" r="3" fill="white" />
        </svg>
      `;
      
      el.appendChild(pin);
      
      // Add pulse effect for pending requests
      if (request.status === 'pending') {
        const pulseEl = document.createElement('div');
        pulseEl.className = 'absolute';
        pulseEl.style.width = '50px';
        pulseEl.style.height = '50px';
        pulseEl.style.borderRadius = '50%';
        pulseEl.style.backgroundColor = 'rgba(249, 115, 22, 0.3)';
        pulseEl.style.transform = 'translate(-50%, -50%)';
        pulseEl.style.zIndex = '-1';
        pulseEl.style.animation = 'pulse 1.5s infinite';
        el.appendChild(pulseEl);
      }
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${request.name}</h3>
          <p class="text-xs">${request.phone}</p>
          <p class="text-xs">${request.location.address}</p>
          <p class="text-xs mt-1">
            <span class="font-medium">Status:</span> 
            <span class="${
              request.status === 'pending' ? 'text-orange-500' : 
              request.status === 'dispatched' ? 'text-blue-500' : 
              request.status === 'completed' ? 'text-green-500' : 'text-red-500'
            }">${request.status}</span>
          </p>
          ${request.notes ? `<p class="text-xs mt-1"><span class="font-medium">Notes:</span> ${request.notes}</p>` : ''}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Show popup if selected
      if (isSelected) {
        marker.togglePopup();
      }
      
      emergencyMarkers.current[request.id] = marker;
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
      
      const { latitude, longitude } = ambulance.lastLocation;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'flex items-center justify-center';
      el.style.width = '30px';
      el.style.height = '30px';

      // Create inner icon element
      const icon = document.createElement('div');
      icon.className = 'relative';
      
      // Style based on status and selection
      const isSelected = selectedAmbulanceId === ambulance.id;
      let color;
      switch (ambulance.status) {
        case 'available':
          color = '#22c55e';
          break;
        case 'dispatched':
          color = '#3b82f6';
          break;
        case 'maintenance':
          color = '#f97316';
          break;
        default:
          color = '#6b7280';
      }
      
      icon.innerHTML = `
        <svg viewBox="0 0 24 24" width="${isSelected ? '30' : '24'}" height="${isSelected ? '30' : '24'}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="2" fill="${color}" stroke="${isSelected ? '#000' : color}" stroke-width="2"/>
          <path d="M7 11V11C7 9.89543 7.89543 9 9 9H15C16.1046 9 17 9.89543 17 11V11" stroke="white" stroke-width="2"/>
          <circle cx="7" cy="15" r="2" fill="white"/>
          <circle cx="17" cy="15" r="2" fill="white"/>
          <path d="M11 5L11 9" stroke="white" stroke-width="2"/>
          <path d="M14 5L14 9" stroke="white" stroke-width="2"/>
        </svg>
      `;
      
      el.appendChild(icon);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${ambulance.name}</h3>
          <p class="text-xs">${ambulance.vehicleNumber}</p>
          <p class="text-xs">
            <span class="font-medium">Driver:</span> ${ambulance.driver.name}
          </p>
          <p class="text-xs">${ambulance.driver.phone}</p>
          <p class="text-xs mt-1">
            <span class="font-medium">Status:</span> 
            <span class="${
              ambulance.status === 'available' ? 'text-green-500' : 
              ambulance.status === 'dispatched' ? 'text-blue-500' : 'text-orange-500'
            }">${ambulance.status}</span>
          </p>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Show popup if selected
      if (isSelected) {
        marker.togglePopup();
      }
      
      ambulanceMarkers.current[ambulance.id] = marker;
    });

    return () => {
      Object.values(ambulanceMarkers.current).forEach(marker => marker.remove());
    };
  }, [mapLoaded, ambulances, selectedAmbulanceId]);

  return <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />;
};

export default MapView;
