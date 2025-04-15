
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PhoneOutgoing, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmergencyRequest } from '@/types';

interface EmergencyRequestsListProps {
  requests: EmergencyRequest[];
  title: string;
  description: string;
}

const EmergencyRequestsList = ({ requests, title, description }: EmergencyRequestsListProps) => {
  const getStatusColor = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending':
      case 'requested':
      case 'confirming':
        return 'bg-orange-500';
      case 'dispatched':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusBadge = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending':
      case 'requested':
      case 'confirming':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>;
      case 'dispatched':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Dispatched</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Link to="/emergencies">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No active emergency requests at the moment</p>
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`mt-1 w-2 h-2 rounded-full ${getStatusColor(request.status)}`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{request.name}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <PhoneOutgoing className="h-3 w-3" />
                        <span>{request.phone}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.location.address}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {format(new Date(request.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <Link to={`/emergencies/${request.id}`}>
                    <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyRequestsList;
