
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EmergencyRequest } from '@/types';

interface EmergencyStatusBadgeProps {
  status: EmergencyRequest['status'];
}

const EmergencyStatusBadge: React.FC<EmergencyStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
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

export default EmergencyStatusBadge;
