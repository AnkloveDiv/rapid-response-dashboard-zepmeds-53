
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmergencyRequest } from '@/types';
import EmergencyStatusBadge from './EmergencyStatusBadge';

interface EmergencyDetailsDialogProps {
  request: EmergencyRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmergencyDetailsDialog: React.FC<EmergencyDetailsDialogProps> = ({
  request,
  isOpen,
  onOpenChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
};

export default EmergencyDetailsDialog;
