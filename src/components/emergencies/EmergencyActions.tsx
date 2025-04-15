
import React from 'react';
import { MoreHorizontal, ClipboardList, AmbulanceIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmergencyRequest } from '@/types';

interface EmergencyActionsProps {
  request: EmergencyRequest;
  onViewDetails: () => void;
  onOpenDispatch: () => void;
}

const EmergencyActions: React.FC<EmergencyActionsProps> = ({
  request,
  onViewDetails,
  onOpenDispatch
}) => {
  // Check if the request is in a state where dispatching is allowed
  const canDispatch = ['pending', 'requested', 'confirming'].includes(request.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onViewDetails}>
          <ClipboardList className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canDispatch && (
          <DropdownMenuItem onClick={onOpenDispatch}>
            <AmbulanceIcon className="mr-2 h-4 w-4" />
            Dispatch Ambulance
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmergencyActions;
