
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Phone } from 'lucide-react';
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { EmergencyRequest } from '@/types';
import EmergencyStatusBadge from './EmergencyStatusBadge';
import EmergencyDetailsDialog from './EmergencyDetailsDialog';
import DispatchAmbulanceDialog from './DispatchAmbulanceDialog';
import EmergencyActions from './EmergencyActions';
import DispatchService from '@/services/DispatchService';

interface EmergencyTableRowProps {
  request: EmergencyRequest;
}

const EmergencyTableRow = ({ request }: EmergencyTableRowProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [availableAmbulances, setAvailableAmbulances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenDispatch = async () => {
    setIsDispatchOpen(true);
    
    try {
      const ambulances = await DispatchService.fetchAvailableAmbulances();
      setAvailableAmbulances(ambulances);
    } catch (error) {
      console.error('Error fetching available ambulances:', error);
      toast({
        title: "Error",
        description: "Failed to load available ambulances.",
        variant: "destructive",
      });
    }
  };

  const handleDispatchAmbulance = async (ambulanceId: string) => {
    if (!ambulanceId) {
      toast({
        title: "Error",
        description: "Please select an ambulance to dispatch.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await DispatchService.dispatchAmbulance(request.id, ambulanceId);
      
      toast({
        title: "Ambulance Dispatched",
        description: "The ambulance has been successfully dispatched to the emergency location.",
      });
      
      setIsDispatchOpen(false);
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
        <EmergencyActions 
          request={request}
          onViewDetails={() => setIsDetailsOpen(true)}
          onOpenDispatch={handleOpenDispatch}
        />
        
        {/* Details Dialog */}
        <EmergencyDetailsDialog 
          request={request}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
        
        {/* Dispatch Dialog */}
        <DispatchAmbulanceDialog 
          request={request}
          isOpen={isDispatchOpen}
          onOpenChange={setIsDispatchOpen}
          ambulances={availableAmbulances}
          onDispatch={handleDispatchAmbulance}
          isLoading={isLoading}
        />
      </TableCell>
    </TableRow>
  );
};

export default EmergencyTableRow;
