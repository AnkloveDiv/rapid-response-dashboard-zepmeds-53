import React, { useState, useEffect } from 'react';
import { AlertTriangle, Ambulance as AmbulanceIcon, CheckCircle2, Navigation, BellRing } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { EmergencyRequest, Ambulance } from '@/types';
import { useToast } from "@/hooks/use-toast";
import AudioService from '@/services/AudioService';
import EmergencyToast from '@/components/notifications/EmergencyToast';
import { useNavigate } from 'react-router-dom';

// Import components
import StatCard from '@/components/dashboard/StatCard';
import EmergencyRequestsList from '@/components/dashboard/EmergencyRequestsList';
import AmbulanceStatus from '@/components/dashboard/AmbulanceStatus';
import SummaryStats from '@/components/dashboard/SummaryStats';

const Dashboard = () => {
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const [requestsResponse, ambulancesResponse] = await Promise.all([
        supabase.from('emergency_requests').select('*').order('timestamp', { ascending: false }),
        supabase.from('ambulances').select('*')
      ]);

      if (requestsResponse.error) throw requestsResponse.error;
      if (ambulancesResponse.error) throw ambulancesResponse.error;

      console.log("Received emergency data:", requestsResponse.data);
      console.log("Received ambulance data:", ambulancesResponse.data);

      const transformedRequests: EmergencyRequest[] = requestsResponse.data.map(item => {
        const locationData = typeof item.location === 'string' 
          ? JSON.parse(item.location) 
          : item.location;
          
        const coordinates = {
          latitude: locationData.latitude || locationData.lat || (locationData.coordinates ? locationData.coordinates.latitude : 0),
          longitude: locationData.longitude || locationData.lng || (locationData.coordinates ? locationData.coordinates.longitude : 0)
        };
          
        return {
          id: item.id,
          name: item.name,
          phone: item.phone,
          timestamp: item.timestamp,
          location: {
            address: locationData.address || '',
            coordinates: coordinates
          },
          status: item.status as EmergencyRequest['status'],
          notes: item.notes || undefined,
          ambulanceId: item.ambulance_id || undefined
        };
      });

      const transformedAmbulances: Ambulance[] = ambulancesResponse.data.map(item => ({
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
          timestamp: item.last_updated || item.updated_at || ''
        } : undefined
      }));

      setEmergencyRequests(transformedRequests);
      setAmbulances(transformedAmbulances);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyNotification = (payload: any) => {
    console.log('New emergency request received:', payload);
    
    // Play emergency alert sound for 5 seconds
    AudioService.playEmergencyAlert(5);
    
    const locationData = typeof payload.new.location === 'string' 
      ? JSON.parse(payload.new.location) 
      : payload.new.location;
    
    const address = locationData.address || 'Location pending';
    
    // Show enhanced emergency toast with details
    toast({
      variant: "emergency",
      title: "New Emergency Request!",
      description: (
        <EmergencyToast
          name={payload.new.name}
          phone={payload.new.phone}
          location={address}
          onDispatch={() => {
            navigate(`/emergencies/${payload.new.id}`);
          }}
        />
      ),
      duration: 10000, // Keep notification visible for 10 seconds
    });
    
    // Refresh dashboard data
    fetchData();
  };

  useEffect(() => {
    fetchData();

    const emergencyChannel = supabase
      .channel('emergency-updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'emergency_requests' 
        }, 
        handleEmergencyNotification
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'emergency_requests'
        },
        (payload) => {
          console.log('Emergency request updated:', payload);
          fetchData();
        }
      )
      .subscribe();

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
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(ambulanceChannel);
    };
  }, [toast, navigate]);

  const pendingRequests = emergencyRequests.filter(req => 
    req.status === 'pending' || req.status === 'requested' || req.status === 'confirming'
  );
  const dispatchedRequests = emergencyRequests.filter(req => req.status === 'dispatched');
  const completedRequests = emergencyRequests.filter(req => req.status === 'completed');
  
  const activeEmergencies = [...pendingRequests, ...dispatchedRequests].slice(0, 5);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Emergency service requests and ambulance status</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Pending Requests"
            value={pendingRequests.length}
            Icon={AlertTriangle}
            bgColor="bg-orange-100"
            textColor="text-orange-500"
            progressValue={pendingRequests.length > 0 ? 100 : 0}
            progressBgColor="bg-orange-100"
          />
          
          <StatCard 
            title="Ambulances Available"
            value={ambulances.filter(a => a.status === 'available').length}
            Icon={AmbulanceIcon}
            bgColor="bg-green-100"
            textColor="text-green-500"
            progressValue={(ambulances.filter(a => a.status === 'available').length / ambulances.length) * 100}
            progressBgColor="bg-green-100"
          />
          
          <StatCard 
            title="In Progress"
            value={dispatchedRequests.length}
            Icon={Navigation}
            bgColor="bg-blue-100"
            textColor="text-blue-500"
            progressValue={dispatchedRequests.length > 0 ? 100 : 0}
            progressBgColor="bg-blue-100"
          />
          
          <StatCard 
            title="Completed Today"
            value={completedRequests.length}
            Icon={CheckCircle2}
            bgColor="bg-purple-100"
            textColor="text-purple-500"
            progressValue={completedRequests.length > 0 ? 100 : 0}
            progressBgColor="bg-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <EmergencyRequestsList 
            requests={activeEmergencies}
            title="Recent Emergency Requests"
            description="Emergency service requests from users"
          />
          
          <AmbulanceStatus ambulances={ambulances} />
        </div>

        <SummaryStats 
          totalRequests={emergencyRequests.length}
          totalAmbulances={ambulances.length}
          patientsServed={completedRequests.length}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
