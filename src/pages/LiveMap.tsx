
import React, { useState, useEffect } from 'react';
import { Loader2, Layers, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';
import MapView from '@/components/MapView';
import { supabase } from '@/integrations/supabase/client';
import { Ambulance, EmergencyRequest } from '@/types';

// Set initial map center to New Delhi
const DEFAULT_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090
};

const LiveMap = () => {
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(null);
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_LOCATION);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch emergency requests
        const { data: emergencyData, error: emergencyError } = await supabase
          .from('emergency_requests')
          .select('*')
          .in('status', ['pending', 'dispatched']);

        if (emergencyError) throw emergencyError;
        
        // Fetch ambulances
        const { data: ambulanceData, error: ambulanceError } = await supabase
          .from('ambulances')
          .select('*');

        if (ambulanceError) throw ambulanceError;

        // Transform emergency requests data
        const transformedEmergencies: EmergencyRequest[] = emergencyData.map(item => {
          const locationData = typeof item.location === 'string' 
            ? JSON.parse(item.location) 
            : item.location;
          
          return {
            id: item.id,
            name: item.name,
            phone: item.phone,
            timestamp: item.timestamp,
            location: {
              address: locationData.address || '',
              coordinates: {
                latitude: locationData.coordinates?.latitude || 0,
                longitude: locationData.coordinates?.longitude || 0
              }
            },
            status: item.status as EmergencyRequest['status'],
            notes: item.notes || undefined,
            ambulanceId: item.ambulance_id || undefined
          };
        });

        // Transform ambulances data
        const transformedAmbulances: Ambulance[] = ambulanceData.map(item => ({
          id: item.id,
          name: item.name,
          vehicleNumber: item.vehicle_number,
          driver: {
            name: item.driver_name,
            phone: item.driver_phone
          },
          status: item.status as Ambulance['status'],
          lastLocation: item.last_latitude && item.last_longitude ? {
            latitude: Number(item.last_latitude),
            longitude: Number(item.last_longitude),
            timestamp: item.last_updated || new Date().toISOString()
          } : undefined
        }));

        setEmergencyRequests(transformedEmergencies);
        setAmbulances(transformedAmbulances);

        // Set initial map center based on data
        if (transformedEmergencies.length > 0) {
          setMapCenter({
            latitude: transformedEmergencies[0].location.coordinates.latitude,
            longitude: transformedEmergencies[0].location.coordinates.longitude
          });
        } else if (transformedAmbulances.length > 0 && transformedAmbulances[0].lastLocation) {
          setMapCenter({
            latitude: transformedAmbulances[0].lastLocation.latitude,
            longitude: transformedAmbulances[0].lastLocation.longitude
          });
        }

      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription for emergency requests
    const emergencyChannel = supabase
      .channel('emergency-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'emergency_requests' 
        }, 
        (payload) => {
          console.log('Emergency request update received:', payload);
          // Re-fetch data on any changes
          fetchData();
        }
      )
      .subscribe();

    // Set up real-time subscription for ambulances
    const ambulanceChannel = supabase
      .channel('ambulance-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'ambulances' 
        }, 
        (payload) => {
          console.log('Ambulance update received:', payload);
          // Re-fetch data on any changes
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(ambulanceChannel);
    };
  }, []);

  const handleSelectEmergency = (emergency: EmergencyRequest) => {
    setSelectedEmergencyId(emergency.id);
    setSelectedAmbulanceId(null);
    setMapCenter(emergency.location.coordinates);
    setZoom(15);
  };

  const handleSelectAmbulance = (ambulance: Ambulance) => {
    if (ambulance.lastLocation) {
      setSelectedAmbulanceId(ambulance.id);
      setSelectedEmergencyId(null);
      setMapCenter({
        latitude: ambulance.lastLocation.latitude,
        longitude: ambulance.lastLocation.longitude
      });
      setZoom(15);
    }
  };

  const getStatusBadge = (status: EmergencyRequest['status'] | Ambulance['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>;
      case 'dispatched':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Dispatched</Badge>;
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const resetMap = () => {
    setSelectedEmergencyId(null);
    setSelectedAmbulanceId(null);
    setMapCenter(DEFAULT_LOCATION);
    setZoom(11);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-500" />
            <p className="mt-4 text-gray-600">Loading map data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Map</h1>
            <p className="text-gray-500">Track emergency requests and ambulance locations in real-time</p>
          </div>
          <Button variant="outline" onClick={resetMap}>
            <Layers className="mr-2 h-4 w-4" />
            Reset View
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-[70vh]">
              <CardContent className="p-0 h-full">
                <MapView 
                  latitude={mapCenter.latitude} 
                  longitude={mapCenter.longitude} 
                  zoom={zoom}
                  emergencyRequests={emergencyRequests}
                  ambulances={ambulances.filter(amb => amb.lastLocation)}
                  selectedEmergencyId={selectedEmergencyId}
                  selectedAmbulanceId={selectedAmbulanceId}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Emergency Requests</CardTitle>
                <CardDescription>
                  {emergencyRequests.length} active requests
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[30vh] overflow-y-auto">
                {emergencyRequests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No active emergency requests</p>
                ) : (
                  <div className="space-y-3">
                    {emergencyRequests.map((emergency) => (
                      <div 
                        key={emergency.id} 
                        className={`p-3 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedEmergencyId === emergency.id ? 'border-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => handleSelectEmergency(emergency)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{emergency.name}</span>
                          {getStatusBadge(emergency.status)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{emergency.location.address}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ambulances</CardTitle>
                <CardDescription>
                  {ambulances.filter(amb => amb.lastLocation).length} tracked vehicles
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[30vh] overflow-y-auto">
                {ambulances.filter(amb => amb.lastLocation).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No ambulances with location data</p>
                ) : (
                  <div className="space-y-3">
                    {ambulances.filter(amb => amb.lastLocation).map((ambulance) => (
                      <div 
                        key={ambulance.id} 
                        className={`p-3 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedAmbulanceId === ambulance.id ? 'border-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => handleSelectAmbulance(ambulance)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{ambulance.name}</span>
                          {getStatusBadge(ambulance.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ambulance.vehicleNumber}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LiveMap;
