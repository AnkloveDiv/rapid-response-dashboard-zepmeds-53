
import { supabase } from '@/integrations/supabase/client';
import { Ambulance } from '@/types';

class DispatchService {
  private static instance: DispatchService;
  
  private constructor() {}
  
  public static getInstance(): DispatchService {
    if (!DispatchService.instance) {
      DispatchService.instance = new DispatchService();
    }
    return DispatchService.instance;
  }

  public async fetchAvailableAmbulances(): Promise<Ambulance[]> {
    try {
      // In a real application this would fetch from Supabase
      // For now we'll return mock data
      const mockAmbulances: Ambulance[] = [
        {
          id: '1',
          name: 'Ambulance A',
          vehicleNumber: 'ZEP-001',
          driver: {
            name: 'John Driver',
            phone: '+12345678901'
          },
          status: 'available'
        },
        {
          id: '2',
          name: 'Ambulance B',
          vehicleNumber: 'ZEP-002',
          driver: {
            name: 'Sarah Medic',
            phone: '+12345678902'
          },
          status: 'available'
        },
        {
          id: '3',
          name: 'Ambulance C',
          vehicleNumber: 'ZEP-003',
          driver: {
            name: 'Mike Rescue',
            phone: '+12345678903'
          },
          status: 'available'
        }
      ];
      
      return mockAmbulances;
      
      // When Supabase integration is complete, use this code instead:
      /*
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available');
        
      if (error) {
        throw error;
      }
      
      return data.map(item => ({
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
      */
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      throw error;
    }
  }

  public async dispatchAmbulance(emergencyId: string, ambulanceId: string): Promise<boolean> {
    try {
      console.log("Dispatching ambulance:", ambulanceId, "for emergency:", emergencyId);
      
      // First, update the emergency request
      const { error: emergencyError } = await supabase
        .from('emergency_requests')
        .update({
          status: 'dispatched',
          ambulance_id: ambulanceId,
          updated_at: new Date().toISOString()
        })
        .eq('id', emergencyId);
        
      if (emergencyError) {
        console.error("Error updating emergency request:", emergencyError);
        throw emergencyError;
      }
      
      // For now, we're not actually updating any ambulance in Supabase
      // This would be added when the ambulances table is available
      
      return true;
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      throw error;
    }
  }
}

export default DispatchService.getInstance();
