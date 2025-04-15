
import { EmergencyRequest, Ambulance, Hospital, User } from '@/types';
import { addDays, subHours, subMinutes, format } from 'date-fns';

// Mock users for login
export const users: User[] = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@zepmeds.com',
    role: 'admin',
    hospitalId: 'hospital1',
  },
  {
    id: 'user2',
    name: 'Dispatch Manager',
    email: 'dispatch@zepmeds.com',
    role: 'dispatcher',
    hospitalId: 'hospital1',
  },
  {
    id: 'user3',
    name: 'Ambulance Driver',
    email: 'driver@zepmeds.com',
    role: 'driver',
    hospitalId: 'hospital1',
  },
];

// Mock hospitals
export const hospitals: Hospital[] = [
  {
    id: 'hospital1',
    name: 'Zepmeds Emergency Services',
    address: '123 Medical Center Blvd, New Delhi',
    phone: '+91-9876543210',
    email: 'contact@zepmeds.com',
    coordinates: {
      latitude: 28.6139,
      longitude: 77.2090,
    },
    ambulances: [],
  },
];

// Mock ambulances
export const ambulances: Ambulance[] = [
  {
    id: 'amb1',
    name: 'Ambulance 1',
    vehicleNumber: 'ZP-AMB-001',
    driver: {
      name: 'Raj Kumar',
      phone: '+91-8765432109',
    },
    status: 'available',
    lastLocation: {
      latitude: 28.6129,
      longitude: 77.2095,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'amb2',
    name: 'Ambulance 2',
    vehicleNumber: 'ZP-AMB-002',
    driver: {
      name: 'Sunil Sharma',
      phone: '+91-7654321098',
    },
    status: 'available',
    lastLocation: {
      latitude: 28.6149,
      longitude: 77.2080,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'amb3',
    name: 'Ambulance 3',
    vehicleNumber: 'ZP-AMB-003',
    driver: {
      name: 'Priya Singh',
      phone: '+91-6543210987',
    },
    status: 'dispatched',
    lastLocation: {
      latitude: 28.6100,
      longitude: 77.2190,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 'amb4',
    name: 'Ambulance 4',
    vehicleNumber: 'ZP-AMB-004',
    driver: {
      name: 'Vijay Patel',
      phone: '+91-5432109876',
    },
    status: 'maintenance',
    lastLocation: {
      latitude: 28.6139,
      longitude: 77.2090,
      timestamp: new Date().toISOString(),
    },
  },
];

// Assign ambulances to hospital
hospitals[0].ambulances = ambulances;

// Generate mock emergency requests with realistic data
export const emergencyRequests: EmergencyRequest[] = [
  {
    id: 'er001',
    name: 'Amit Verma',
    phone: '+91-9876543210',
    timestamp: new Date().toISOString(),
    location: {
      address: '42 Lajpat Nagar, New Delhi',
      coordinates: {
        latitude: 28.5694,
        longitude: 77.2491,
      },
    },
    status: 'pending',
    notes: 'Patient reporting chest pain and difficulty breathing',
  },
  {
    id: 'er002',
    name: 'Neha Gupta',
    phone: '+91-8765432109',
    timestamp: subMinutes(new Date(), 15).toISOString(),
    location: {
      address: '78 Hauz Khas, New Delhi',
      coordinates: {
        latitude: 28.5494,
        longitude: 77.2001,
      },
    },
    status: 'dispatched',
    ambulanceId: 'amb3',
    notes: 'Fall from stairs, possible fracture',
  },
  {
    id: 'er003',
    name: 'Rakesh Singh',
    phone: '+91-7654321098',
    timestamp: subMinutes(new Date(), 45).toISOString(),
    location: {
      address: '23 Connaught Place, New Delhi',
      coordinates: {
        latitude: 28.6304,
        longitude: 77.2177,
      },
    },
    status: 'completed',
    ambulanceId: 'amb1',
  },
  {
    id: 'er004',
    name: 'Pooja Sharma',
    phone: '+91-6543210987',
    timestamp: subHours(new Date(), 2).toISOString(),
    location: {
      address: '56 Dwarka, New Delhi',
      coordinates: {
        latitude: 28.5921,
        longitude: 77.0460,
      },
    },
    status: 'completed',
    ambulanceId: 'amb2',
  },
  {
    id: 'er005',
    name: 'Karan Malhotra',
    phone: '+91-9876543211',
    timestamp: subHours(new Date(), 3).toISOString(),
    location: {
      address: '12 Rohini, New Delhi',
      coordinates: {
        latitude: 28.7404,
        longitude: 77.1265,
      },
    },
    status: 'cancelled',
  },
  {
    id: 'er006',
    name: 'Anjali Kumar',
    phone: '+91-9876543212',
    timestamp: subHours(new Date(), 5).toISOString(),
    location: {
      address: '99 Vasant Kunj, New Delhi',
      coordinates: {
        latitude: 28.5200,
        longitude: 77.1500,
      },
    },
    status: 'completed',
    ambulanceId: 'amb1',
  },
  {
    id: 'er007',
    name: 'Deepak Choudhary',
    phone: '+91-9876543213',
    timestamp: subHours(new Date(), 8).toISOString(),
    location: {
      address: '34 Greater Kailash, New Delhi',
      coordinates: {
        latitude: 28.5439,
        longitude: 77.2430,
      },
    },
    status: 'completed',
    ambulanceId: 'amb2',
  }
];

// Service to simulate API calls
export const mockService = {
  // Auth
  login: (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    return user ? Promise.resolve({ success: true, user }) : Promise.reject(new Error('Invalid credentials'));
  },
  
  // Emergency Requests
  getEmergencyRequests: () => {
    return Promise.resolve(emergencyRequests);
  },
  
  getEmergencyRequestById: (id: string) => {
    const request = emergencyRequests.find(er => er.id === id);
    return request ? Promise.resolve(request) : Promise.reject(new Error('Request not found'));
  },
  
  updateEmergencyRequestStatus: (id: string, status: EmergencyRequest['status'], ambulanceId?: string) => {
    const index = emergencyRequests.findIndex(er => er.id === id);
    if (index !== -1) {
      emergencyRequests[index].status = status;
      if (ambulanceId) {
        emergencyRequests[index].ambulanceId = ambulanceId;
      }
      return Promise.resolve(emergencyRequests[index]);
    }
    return Promise.reject(new Error('Request not found'));
  },
  
  // Ambulances
  getAmbulances: () => {
    return Promise.resolve(ambulances);
  },
  
  getAvailableAmbulances: () => {
    return Promise.resolve(ambulances.filter(amb => amb.status === 'available'));
  },
  
  updateAmbulanceStatus: (id: string, status: Ambulance['status']) => {
    const index = ambulances.findIndex(amb => amb.id === id);
    if (index !== -1) {
      ambulances[index].status = status;
      return Promise.resolve(ambulances[index]);
    }
    return Promise.reject(new Error('Ambulance not found'));
  },
  
  // Hospitals
  getHospitals: () => {
    return Promise.resolve(hospitals);
  },
  
  getHospitalById: (id: string) => {
    const hospital = hospitals.find(h => h.id === id);
    return hospital ? Promise.resolve(hospital) : Promise.reject(new Error('Hospital not found'));
  }
};
