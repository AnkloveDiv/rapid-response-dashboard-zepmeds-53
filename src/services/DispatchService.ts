
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

class DispatchService {
  private static instance: DispatchService;
  
  private constructor() {}
  
  public static getInstance(): DispatchService {
    if (!DispatchService.instance) {
      DispatchService.instance = new DispatchService();
    }
    return DispatchService.instance;
  }

  public async fetchAvailableAmbulances() {
    try {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available');
        
      if (error) {
        throw error;
      }
      
      const transformedData = data.map(item => ({
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
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      throw error;
    }
  }

  public async dispatchAmbulance(emergencyId: string, ambulanceId: string) {
    try {
      console.log("Dispatching ambulance:", ambulanceId, "for emergency:", emergencyId);
      
      // Update the emergency request
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
      
      // Update the ambulance status
      const { error: ambulanceError } = await supabase
        .from('ambulances')
        .update({
          status: 'dispatched',
          updated_at: new Date().toISOString()
        })
        .eq('id', ambulanceId);
        
      if (ambulanceError) {
        console.error("Error updating ambulance:", ambulanceError);
        throw ambulanceError;
      }
      
      return true;
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      throw error;
    }
  }
}

export default DispatchService.getInstance();
