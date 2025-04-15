
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MapPin, MoreHorizontal, Phone, ClipboardList } from 'lucide-react';
import { AmbulanceIcon } from 'lucide-react'; // Renamed the Ambulance icon import
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EmergencyRequest, Ambulance } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import EmergencyStatusBadge from './EmergencyStatusBadge';

interface EmergencyTableRowProps {
  request: EmergencyRequest;
}

const EmergencyTableRow = ({ request }: EmergencyTableRowProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('');
  const [availableAmbulances, setAvailableAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenDispatch = async () => {
    setIsDispatchOpen(true);
    
    try {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available');
        
      if (error) {
        throw error;
      }
      
      const transformedData: Ambulance[] = data.map(item => ({
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
      
      setAvailableAmbulances(transformedData);
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      toast({
        title: "Error",
        description: "Failed to load available ambulances.",
        variant: "destructive",
      });
    }
  };

  const handleDispatchAmbulance = async () => {
    if (!selectedAmbulanceId) {
      toast({
        title: "Error",
        description: "Please select an ambulance to dispatch.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Start a transaction to update both the emergency request and ambulance
      // 1. Update the emergency request
      const { error: emergencyError } = await supabase
        .from('emergency_requests')
        .update({
          status: 'dispatched',
          ambulance_id: selectedAmbulanceId,
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);
        
      if (emergencyError) {
        throw emergencyError;
      }
      
      // 2. Update the ambulance status
      const { error: ambulanceError } = await supabase
        .from('ambulances')
        .update({
          status: 'dispatched',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAmbulanceId);
        
      if (ambulanceError) {
        throw ambulanceError;
      }
      
      toast({
        title: "Ambulance Dispatched",
        description: "The ambulance has been successfully dispatched to the emergency location.",
      });
      
      setIsDispatchOpen(false);
      setSelectedAmbulanceId('');
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
      toast({
        title: "Error",
        description: "Failed to dispatch ambulance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableRow key={request.id}>
      <TableCell>
        <EmergencyStatusBadge status={request.status} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <div className="font-medium">{request.name}</div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="mr-1 h-3 w-3" />
            {request.phone}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
          <span className="text-sm">{request.location.address}</span>
        </div>
      </TableCell>
      <TableCell>
        {format(new Date(request.timestamp), 'MMM d, h:mm a')}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
              <ClipboardList className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {request.status === 'pending' && (
              <DropdownMenuItem onClick={handleOpenDispatch}>
                <AmbulanceIcon className="mr-2 h-4 w-4" />
                Dispatch Ambulance
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Emergency Request Details</DialogTitle>
              <DialogDescription>
                Complete information about this emergency request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  <EmergencyStatusBadge status={request.status} />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                <p className="text-sm">{request.name}</p>
                <p className="text-sm text-gray-500">{request.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-sm">{request.location.address}</p>
                <p className="text-xs text-gray-500">
                  Coordinates: {request.location.coordinates.latitude.toFixed(4)}, {request.location.coordinates.longitude.toFixed(4)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Time Received</h3>
                <p className="text-sm">{format(new Date(request.timestamp), 'PPpp')}</p>
              </div>
              
              {request.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                  <p className="text-sm">{request.notes}</p>
                </div>
              )}
              
              {request.ambulanceId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned Ambulance</h3>
                  <p className="text-sm">{request.ambulanceId}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Dispatch Dialog */}
        <Dialog open={isDispatchOpen} onOpenChange={setIsDispatchOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Dispatch Ambulance</DialogTitle>
              <DialogDescription>
                Select an ambulance to dispatch to this emergency.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Emergency Details</h3>
                <p className="text-sm"><span className="font-medium">Patient:</span> {request.name}</p>
                <p className="text-sm"><span className="font-medium">Location:</span> {request.location.address}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Available Ambulances</h3>
                {availableAmbulances.length === 0 ? (
                  <p className="text-sm text-gray-500">No ambulances available</p>
                ) : (
                  <Select value={selectedAmbulanceId} onValueChange={setSelectedAmbulanceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an ambulance" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAmbulances.map(ambulance => (
                        <SelectItem key={ambulance.id} value={ambulance.id}>
                          {ambulance.name} ({ambulance.vehicleNumber}) - {ambulance.driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDispatchOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleDispatchAmbulance}
                disabled={!selectedAmbulanceId || availableAmbulances.length === 0 || isLoading}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {isLoading ? "Dispatching..." : "Dispatch Ambulance"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default EmergencyTableRow;
