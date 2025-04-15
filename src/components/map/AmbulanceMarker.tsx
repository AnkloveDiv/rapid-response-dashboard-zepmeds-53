
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Ambulance } from '@/types';

class AmbulanceMarker {
  ambulance: Ambulance;
  isSelected: boolean;
  marker: mapboxgl.Marker;
  popup: mapboxgl.Popup;
  map: mapboxgl.Map;
  
  constructor(ambulance: Ambulance, isSelected: boolean, map: mapboxgl.Map) {
    this.ambulance = ambulance;
    this.isSelected = isSelected;
    this.map = map;
    
    if (!ambulance.lastLocation) {
      throw new Error('Ambulance has no location');
    }
    
    // Create marker element
    const el = document.createElement('div');
    el.className = 'flex items-center justify-center';
    el.style.width = '30px';
    el.style.height = '30px';

    // Create inner icon element
    const icon = document.createElement('div');
    icon.className = 'relative';
    
    // Style based on status and selection
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
    this.popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
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
    this.marker = new mapboxgl.Marker(el)
      .setLngLat([ambulance.lastLocation.longitude, ambulance.lastLocation.latitude])
      .setPopup(this.popup)
      .addTo(map);
    
    // Show popup if selected
    if (isSelected) {
      this.marker.togglePopup();
    }
  }
  
  remove() {
    this.marker.remove();
  }
  
  update(ambulance: Ambulance, isSelected: boolean) {
    this.remove();
    return new AmbulanceMarker(ambulance, isSelected, this.map);
  }
}

export default AmbulanceMarker;
