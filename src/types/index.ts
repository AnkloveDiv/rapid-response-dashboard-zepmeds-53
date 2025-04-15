// Types for emergency request data
export interface EmergencyRequest {
  id: string;
  name: string;
  phone: string;
  timestamp: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: 'pending' | 'dispatched' | 'completed' | 'cancelled' | 'requested' | 'confirming' | 'en_route' | 'arrived';
  notes?: string;
  ambulanceId?: string;
}

// Types for ambulance data
export interface Ambulance {
  id: string;
  name: string;
  vehicleNumber: string;
  driver: {
    name: string;
    phone: string;
  };
  status: 'available' | 'dispatched' | 'maintenance';
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

// Types for hospital/firm data
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  ambulances: Ambulance[];
}

// Types for user authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dispatcher' | 'driver';
  hospitalId: string;
}
