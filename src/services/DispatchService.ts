
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
      console.log("Fetching available ambulances...");
      
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
        console.log("Received ambulance data:", data);
        
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
        console.warn("No ambulances found in Supabase, creating default ambulances");
        
        // Create mock ambulances if none exist
        const mockAmbulances = [
          {
            name: 'Ambulance A',
            vehicle_number: 'ZEP-001',
            driver_name: 'John Driver',
            driver_phone: '+12345678901',
            status: 'available',
            last_latitude: 28.6139,
            last_longitude: 77.2090
          },
          {
            name: 'Ambulance B',
            vehicle_number: 'ZEP-002',
            driver_name: 'Sarah Medic',
            driver_phone: '+12345678902',
            status: 'available',
            last_latitude: 28.6149,
            last_longitude: 77.2080
          }
        ];
        
        // Insert the mock ambulances into the database
        const { data: newAmbulances, error: insertError } = await supabase
          .from('ambulances')
          .insert(mockAmbulances)
          .select();
          
        if (insertError) {
          console.error("Error creating default ambulances:", insertError);
          // Fall back to mock data if insert fails
          return this.getMockAmbulances();
        }
        
        if (newAmbulances && newAmbulances.length > 0) {
          console.log("Created new ambulances:", newAmbulances);
          
          return newAmbulances.map(ambulance => ({
            id: ambulance.id,
            name: ambulance.name,
            vehicleNumber: ambulance.vehicle_number,
            driver: {
              name: ambulance.driver_name,
              phone: ambulance.driver_phone
            },
            status: ambulance.status as 'available' | 'dispatched' | 'maintenance',
            lastLocation: ambulance.last_latitude && ambulance.last_longitude ? {
              latitude: Number(ambulance.last_latitude),
              longitude: Number(ambulance.last_longitude),
              timestamp: ambulance.last_updated || new Date().toISOString()
            } : undefined
          }));
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
        status: 'available',
        lastLocation: {
          latitude: 28.6139,
          longitude: 77.2090,
          timestamp: new Date().toISOString()
        }
      },
      {
        id: '2',
        name: 'Ambulance B',
        vehicleNumber: 'ZEP-002',
        driver: {
          name: 'Sarah Medic',
          phone: '+12345678902'
        },
        status: 'available',
        lastLocation: {
          latitude: 28.6149,
          longitude: 77.2080,
          timestamp: new Date().toISOString()
        }
      }
    ];
    
    return mockAmbulances;
  }

  public async dispatchAmbulance(emergencyId: string, ambulanceId: string): Promise<boolean> {
    try {
      console.log("Dispatching ambulance:", ambulanceId, "for emergency:", emergencyId);
      
      // Check if ambulanceId is in UUID format
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ambulanceId);
      
      // If it's not a valid UUID (like from mock data), we need to get a real ambulance ID
      if (!isValidUuid) {
        console.log("Invalid ambulance UUID format, fetching a valid ambulance");
        
        // First check if we have any ambulances
        const { data: existingAmbulances, error: checkError } = await supabase
          .from('ambulances')
          .select('id')
          .eq('status', 'available')
          .limit(1);
          
        if (checkError) {
          console.error("Error checking for existing ambulances:", checkError);
          throw new Error("Failed to find available ambulances");
        }
        
        if (!existingAmbulances || existingAmbulances.length === 0) {
          // Create a new ambulance if none are available
          const newAmbulance = {
            name: 'Emergency Ambulance',
            vehicle_number: 'ZEP-999',
            driver_name: 'Emergency Driver',
            driver_phone: '+19999999999',
            status: 'available',
            last_latitude: 28.6139,
            last_longitude: 77.2090
          };
          
          const { data: createdAmbulance, error: insertError } = await supabase
            .from('ambulances')
            .insert(newAmbulance)
            .select()
            .single();
            
          if (insertError || !createdAmbulance) {
            throw new Error("Failed to create an ambulance. Please check database permissions.");
          }
          
          ambulanceId = createdAmbulance.id;
        } else {
          // Use an existing ambulance
          ambulanceId = existingAmbulances[0].id;
        }
        
        console.log("Using ambulance UUID:", ambulanceId);
      }
      
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
      
      // Update the ambulance status to dispatched
      const { error: ambulanceError } = await supabase
        .from('ambulances')
        .update({
          status: 'dispatched',
          updated_at: new Date().toISOString()
        })
        .eq('id', ambulanceId);
        
      if (ambulanceError) {
        console.error("Error updating ambulance status:", ambulanceError);
        // Continue execution even if the ambulance update fails
      }
      
      return true;
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      throw error;
    }
  }
}

export default DispatchService.getInstance();
