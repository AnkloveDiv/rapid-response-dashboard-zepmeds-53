
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Ambulance } from '@/types';

interface AmbulanceStatusProps {
  ambulances: Ambulance[];
}

const AmbulanceStatus = ({ ambulances }: AmbulanceStatusProps) => {
  const availableAmbulances = ambulances.filter(amb => amb.status === 'available');
  const dispatchedAmbulances = ambulances.filter(amb => amb.status === 'dispatched');
  const maintenanceAmbulances = ambulances.filter(amb => amb.status === 'maintenance');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ambulance Status</CardTitle>
        <CardDescription>
          Current status of all ambulances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Available</h4>
              <span className="text-sm font-medium text-green-500">{availableAmbulances.length}</span>
            </div>
            <Progress value={(availableAmbulances.length / ambulances.length) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Dispatched</h4>
              <span className="text-sm font-medium text-blue-500">{dispatchedAmbulances.length}</span>
            </div>
            <Progress value={(dispatchedAmbulances.length / ambulances.length) * 100} className="h-2 bg-blue-100" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">Maintenance</h4>
              <span className="text-sm font-medium text-orange-500">{maintenanceAmbulances.length}</span>
            </div>
            <Progress value={(maintenanceAmbulances.length / ambulances.length) * 100} className="h-2 bg-orange-100" />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-3">Available Ambulances</h4>
            <div className="space-y-3">
              {availableAmbulances.map((ambulance) => (
                <div key={ambulance.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">{ambulance.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{ambulance.vehicleNumber}</span>
                </div>
              ))}
              {availableAmbulances.length === 0 && (
                <p className="text-sm text-gray-500">No ambulances available</p>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-3">Dispatched Ambulances</h4>
            <div className="space-y-3">
              {dispatchedAmbulances.map((ambulance) => (
                <div key={ambulance.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">{ambulance.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{ambulance.vehicleNumber}</span>
                </div>
              ))}
              {dispatchedAmbulances.length === 0 && (
                <p className="text-sm text-gray-500">No ambulances dispatched</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmbulanceStatus;
