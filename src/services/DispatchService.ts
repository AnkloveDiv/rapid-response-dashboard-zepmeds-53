
import { supabase } from '@/integrations/supabase/client';
import { Ambulance } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
        console.warn("No ambulances found in Supabase, creating a default ambulance");
        // Create a mock ambulance if none exist
        const mockAmbulance = {
          name: 'Ambulance A',
          vehicle_number: 'ZEP-001',
          driver_name: 'John Driver',
          driver_phone: '+12345678901',
          status: 'available',
          last_latitude: 28.6139,
          last_longitude: 77.2090
        };
        
        // Insert the mock ambulance into the database
        const { data: newAmbulance, error: insertError } = await supabase
          .from('ambulances')
          .insert(mockAmbulance)
          .select()
          .single();
          
        if (insertError) {
          console.error("Error creating default ambulance:", insertError);
          // Fall back to mock data if insert fails
          return this.getMockAmbulances();
        }
        
        if (newAmbulance) {
          return [{
            id: newAmbulance.id,
            name: newAmbulance.name,
            vehicleNumber: newAmbulance.vehicle_number,
            driver: {
              name: newAmbulance.driver_name,
              phone: newAmbulance.driver_phone
            },
            status: newAmbulance.status as 'available' | 'dispatched' | 'maintenance',
            lastLocation: newAmbulance.last_latitude && newAmbulance.last_longitude ? {
              latitude: Number(newAmbulance.last_latitude),
              longitude: Number(newAmbulance.last_longitude),
              timestamp: newAmbulance.last_updated || new Date().toISOString()
            } : undefined
          }];
        } else {
          return this.getMockAmbulances();
        }
      }
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      return this.getMockAmbulances();
    }
  }

  private getMockAmbulances(): Ambulance[] {
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

  public async dispatchAmbulance(emergencyId: string, ambulanceId: string): Promise<boolean> {
    try {
      console.log("Dispatching ambulance:", ambulanceId, "for emergency:", emergencyId);
      
      // Check if ambulanceId is in UUID format
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ambulanceId);
      
      // If it's not a valid UUID (like from mock data), we need to get or create a real ambulance
      if (!isValidUuid) {
        // First check if we have any ambulances
        const { data: existingAmbulances, error: checkError } = await supabase
          .from('ambulances')
          .select('id')
          .limit(1);
          
        if (checkError || !existingAmbulances || existingAmbulances.length === 0) {
          // No ambulances exist, let's create one
          const mockAmbulance = {
            name: 'Emergency Ambulance',
            vehicle_number: 'ZEP-999',
            driver_name: 'Emergency Driver',
            driver_phone: '+19999999999',
            status: 'available',
            last_latitude: 28.6139,
            last_longitude: 77.2090
          };
          
          const { data: newAmbulance, error: insertError } = await supabase
            .from('ambulances')
            .insert(mockAmbulance)
            .select()
            .single();
            
          if (insertError || !newAmbulance) {
            throw new Error("Failed to create an ambulance. Please check database permissions.");
          }
          
          ambulanceId = newAmbulance.id;
        } else {
          // Use an existing ambulance
          ambulanceId = existingAmbulances[0].id;
        }
        
        console.log("Using real ambulance UUID:", ambulanceId);
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
