
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import MapView from '@/components/MapView';
import { Ambulance } from '@/types';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Navigation } from 'lucide-react';

const LiveTracking = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(null);
  const [center, setCenter] = useState({ latitude: 28.6139, longitude: 77.2090 }); // Default to Delhi

  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        const { data, error } = await supabase
          .from('ambulances')
          .select('*');
        
        if (error) throw error;
        
        const transformedData: Ambulance[] = data.map(item => ({
          id: item.id,
          name: item.name,
          vehicleNumber: item.vehicle_number,
          driver: {
            name: item.driver_name,
            phone: item.driver_phone
          },
          status: item.status as 'available' | 'dispatched' | 'maintenance',
          lastLocation: item.last_latitude && item.last_longitude ? {
            latitude: Number(item.last_latitude),
            longitude: Number(item.last_longitude),
            timestamp: item.last_updated || new Date().toISOString()
          } : undefined
        }));

        setAmbulances(transformedData);
        
        // Set center to the first ambulance with location if available
        const ambulanceWithLocation = transformedData.find(amb => amb.lastLocation);
        if (ambulanceWithLocation?.lastLocation) {
          setCenter({
            latitude: ambulanceWithLocation.lastLocation.latitude,
            longitude: ambulanceWithLocation.lastLocation.longitude
          });
        }
      } catch (error) {
        console.error('Error fetching ambulances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();

    // Set up real-time listener for ambulance updates
    const channel = supabase
      .channel('ambulance-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'ambulances' }, 
        (payload) => {
          console.log('Ambulance updated:', payload);
          fetchAmbulances(); // Refresh data when updates occur
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAmbulanceSelect = (ambulanceId: string) => {
    setSelectedAmbulanceId(ambulanceId);
    const selectedAmbulance = ambulances.find(amb => amb.id === ambulanceId);
    if (selectedAmbulance?.lastLocation) {
      setCenter({
        latitude: selectedAmbulance.lastLocation.latitude,
        longitude: selectedAmbulance.lastLocation.longitude
      });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Ambulance Live Tracking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Ambulance Fleet</CardTitle>
                <CardDescription>Select an ambulance to track</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-14 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {ambulances.map(ambulance => (
                      <div 
                        key={ambulance.id}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedAmbulanceId === ambulance.id 
                            ? 'bg-purple-50 border-purple-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleAmbulanceSelect(ambulance.id)}
                      >
                        <div className="font-medium">{ambulance.name}</div>
                        <div className="text-sm text-gray-500">
                          {ambulance.vehicleNumber} • {ambulance.driver.name}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            ambulance.status === 'available' ? 'bg-green-500' :
                            ambulance.status === 'dispatched' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></span>
                          <span className="text-xs text-gray-600 capitalize">{ambulance.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <CardTitle>Live Location Map</CardTitle>
                <CardDescription>
                  {selectedAmbulanceId 
                    ? `Tracking ${ambulances.find(a => a.id === selectedAmbulanceId)?.name}` 
                    : 'Select an ambulance to track'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[520px] p-0">
                <MapView 
                  latitude={center.latitude} 
                  longitude={center.longitude}
                  zoom={13}
                  ambulances={ambulances}
                  selectedAmbulanceId={selectedAmbulanceId}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LiveTracking;
