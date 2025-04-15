
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
import { useNavigate } from 'react-router-dom';

interface EmergencyTableRowProps {
  request: EmergencyRequest;
  onStatusChange: () => void; // Added this line to explicitly define the prop
}

const EmergencyTableRow = ({ request, onStatusChange }: EmergencyTableRowProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewFullDetails = () => {
    navigate(`/emergencies/${request.id}`);
  };

  const handleDispatchSuccess = () => {
    onStatusChange(); // Call the onStatusChange prop when dispatch is successful
    toast({
      title: "Ambulance Dispatched",
      description: "The ambulance has been successfully dispatched to the emergency location.",
    });
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
          onViewDetails={handleViewFullDetails}
          onOpenDispatch={() => setIsDispatchOpen(true)}
        />
        
        {/* Dispatch Dialog */}
        <DispatchAmbulanceDialog 
          request={request}
          isOpen={isDispatchOpen}
          onOpenChange={setIsDispatchOpen}
          onDispatchSuccess={handleDispatchSuccess}
        />
      </TableCell>
    </TableRow>
  );
};

export default EmergencyTableRow;
