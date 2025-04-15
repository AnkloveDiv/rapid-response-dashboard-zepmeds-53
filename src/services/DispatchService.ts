
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
      // First try to fetch from Supabase
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available');
        
      if (error) {
        console.error("Error fetching ambulances from Supabase:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Transform Supabase data to match our Ambulance type
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
      } else {
        console.warn("No ambulances found in Supabase, using mock data instead");
        // Fall back to mock data if no data from Supabase
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
      }
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      throw error;
    }
  }

  public async dispatchAmbulance(emergencyId: string, ambulanceId: string): Promise<boolean> {
    try {
      console.log("Dispatching ambulance:", ambulanceId, "for emergency:", emergencyId);
      
      // Ensure the ambulanceId is a valid UUID string by checking if it's in correct format
      // This handles the case where ambulanceId might be a numeric string from mock data
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ambulanceId)) {
        // If using mock data, fetch a real UUID from the database to use instead
        const { data, error } = await supabase
          .from('ambulances')
          .select('id')
          .limit(1);
          
        if (error || !data || data.length === 0) {
          throw new Error("Failed to get a valid ambulance UUID. Please ensure ambulances exist in the database.");
        }
        
        // Use a real UUID from the database
        ambulanceId = data[0].id;
        console.log("Using real ambulance UUID from database:", ambulanceId);
      }
      
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
      
      // Also update the ambulance status to dispatched
      const { error: ambulanceError } = await supabase
        .from('ambulances')
        .update({
          status: 'dispatched',
          updated_at: new Date().toISOString()
        })
        .eq('id', ambulanceId);
        
      if (ambulanceError) {
        console.error("Error updating ambulance status:", ambulanceError);
        // Don't throw here, as the emergency was successfully updated
        // Just log the error and continue
      }
      
      return true;
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      throw error;
    }
  }
}

export default DispatchService.getInstance();
