
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PhoneCall, Ambulance as AmbulanceIcon, Users } from 'lucide-react';

interface SummaryStatsProps {
  totalRequests: number;
  totalAmbulances: number;
  patientsServed: number;
}

const SummaryStats = ({ totalRequests, totalAmbulances, patientsServed }: SummaryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <PhoneCall className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold">{totalRequests}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Requests</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <AmbulanceIcon className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{totalAmbulances}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Ambulances</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">{patientsServed}</h3>
            <p className="text-sm text-gray-500 mt-1">Patients Served</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
