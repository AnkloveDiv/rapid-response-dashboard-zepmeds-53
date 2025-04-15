
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { EmergencyRequest } from '@/types';

interface EmergencyMarkerProps {
  request: EmergencyRequest;
  isSelected: boolean;
  map: mapboxgl.Map;
}

class EmergencyMarker {
  request: EmergencyRequest;
  isSelected: boolean;
  marker: mapboxgl.Marker;
  popup: mapboxgl.Popup;
  map: mapboxgl.Map;
  
  constructor(request: EmergencyRequest, isSelected: boolean, map: mapboxgl.Map) {
    this.request = request;
    this.isSelected = isSelected;
    this.map = map;
    
    // Create marker element
    const el = document.createElement('div');
    el.className = 'flex items-center justify-center';
    el.style.width = '30px';
    el.style.height = '30px';

    // Create inner pin element
    const pin = document.createElement('div');
    pin.className = 'relative';
    
    // Style based on status and selection
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
    this.popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
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
    this.marker = new mapboxgl.Marker(el)
      .setLngLat([request.location.coordinates.longitude, request.location.coordinates.latitude])
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
  
  update(request: EmergencyRequest, isSelected: boolean) {
    this.remove();
    return new EmergencyMarker(request, isSelected, this.map);
  }
}

export default EmergencyMarker;
