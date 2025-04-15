
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import MapView from '@/components/MapView';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital } from '@/types';
import { Building, Navigation, Search, Map as MapIcon, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';

const NearestHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState({ 
    latitude: 28.6139, 
    longitude: 77.2090
  });
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }

    // Fetch hospitals data
    const fetchHospitals = async () => {
      try {
        // This is mock data for demonstration
        // In a real app, you would fetch this from your database
        const mockHospitals: Hospital[] = [
          {
            id: '1',
            name: 'City General Hospital',
            address: '123 Main St, City Center',
            phone: '+91 2345678901',
            email: 'info@citygeneral.com',
            coordinates: {
              latitude: 28.6200,
              longitude: 77.2100
            },
            ambulances: []
          },
          {
            id: '2',
            name: 'Metro Medical Center',
            address: '456 Park Ave, Downtown',
            phone: '+91 3456789012',
            email: 'contact@metromedical.com',
            coordinates: {
              latitude: 28.6150,
              longitude: 77.2050
            },
            ambulances: []
          },
          {
            id: '3',
            name: 'Sunshine Hospital',
            address: '789 East Blvd, Riverside',
            phone: '+91 4567890123',
            email: 'help@sunshinehospital.com',
            coordinates: {
              latitude: 28.6100,
              longitude: 77.2150
            },
            ambulances: []
          }
        ];

        setHospitals(mockHospitals);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const getNavigationLink = (hospital: Hospital) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.latitude},${hospital.coordinates.longitude}`;
  };

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospitalId(hospital.id);
    setUserLocation({
      latitude: hospital.coordinates.latitude,
      longitude: hospital.coordinates.longitude
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Nearest Hospitals</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search hospitals by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : (
              filteredHospitals.map(hospital => {
                const distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  hospital.coordinates.latitude,
                  hospital.coordinates.longitude
                ).toFixed(1);
                
                return (
                  <Card 
                    key={hospital.id}
                    className={`cursor-pointer transition-shadow hover:shadow-md ${
                      selectedHospitalId === hospital.id ? 'border-purple-300 ring-1 ring-purple-300' : ''
                    }`}
                    onClick={() => handleSelectHospital(hospital)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-gray-500" />
                            {hospital.name}
                          </CardTitle>
                          <CardDescription>{hospital.address}</CardDescription>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {distance} km
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{hospital.phone}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => window.open(`tel:${hospital.phone}`, '_blank')}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button 
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                            size="sm"
                            onClick={() => window.open(getNavigationLink(hospital), '_blank')}
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MapIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Hospitals Map
                </CardTitle>
                <CardDescription>
                  {selectedHospitalId 
                    ? `Viewing: ${hospitals.find(h => h.id === selectedHospitalId)?.name}` 
                    : 'Select a hospital for details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[520px] p-0">
                <MapView 
                  latitude={userLocation.latitude} 
                  longitude={userLocation.longitude}
                  zoom={13}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NearestHospitals;
