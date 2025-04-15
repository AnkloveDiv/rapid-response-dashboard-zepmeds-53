
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmergencyRequest, Ambulance } from '@/types';

interface DispatchAmbulanceDialogProps {
  request: EmergencyRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ambulances: Ambulance[];
  onDispatch: (ambulanceId: string) => void;
  isLoading: boolean;
}

const DispatchAmbulanceDialog: React.FC<DispatchAmbulanceDialogProps> = ({
  request,
  isOpen,
  onOpenChange,
  ambulances,
  onDispatch,
  isLoading
}) => {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('');

  const handleDispatch = () => {
    onDispatch(selectedAmbulanceId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            {ambulances.length === 0 ? (
              <p className="text-sm text-gray-500">No ambulances available</p>
            ) : (
              <Select value={selectedAmbulanceId} onValueChange={setSelectedAmbulanceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an ambulance" />
                </SelectTrigger>
                <SelectContent>
                  {ambulances.map(ambulance => (
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleDispatch}
            disabled={!selectedAmbulanceId || ambulances.length === 0 || isLoading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isLoading ? "Dispatching..." : "Dispatch Ambulance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchAmbulanceDialog;
