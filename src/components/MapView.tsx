
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Temporary public token - In production, this would come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1hY2NvdW50LXplcG1lZHMiLCJhIjoiY2tlMHpxYXJpMGI3YjJ6cnZ5N21janF3YSJ9.D2YGJDvj6kRhPpQ1NXvr7A';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, zoom = 15 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add custom marker for emergency location
    marker.current = new mapboxgl.Marker({
      color: '#EA384C', // Red color
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add pulsing dot effect
    const el = document.createElement('div');
    el.className = 'pulse';
    el.style.backgroundColor = 'rgba(234, 56, 76, 0.3)';
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.borderRadius = '50%';
    el.style.position = 'absolute';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.animation = 'pulse 1.5s infinite';

    // Add a CSS animation for the pulsing effect
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(234, 56, 76, 0.5);
        }
        70% {
          box-shadow: 0 0 0 25px rgba(234, 56, 76, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(234, 56, 76, 0);
        }
      }
    `;
    document.head.appendChild(style);

    new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, zoom]);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default MapView;
