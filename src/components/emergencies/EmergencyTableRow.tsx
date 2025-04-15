
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Clock, PhoneOutgoing, Eye, Ambulance } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmergencyStatusBadge from './EmergencyStatusBadge';
import { EmergencyRequest } from '@/types';

interface EmergencyTableRowProps {
  request: EmergencyRequest;
}

const EmergencyTableRow: React.FC<EmergencyTableRowProps> = ({ request }) => {
  return (
    <TableRow>
      <TableCell><EmergencyStatusBadge status={request.status} /></TableCell>
      <TableCell>
        <div className="font-medium">{request.name}</div>
        <div className="flex items-center text-sm text-gray-500">
          <PhoneOutgoing className="mr-1 h-3 w-3" />
          {request.phone}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-start">
          <MapPin className="mr-1 h-4 w-4 text-gray-500 mt-0.5" />
          <span className="text-sm">{request.location.address}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4 text-gray-500" />
          <span className="text-sm">{format(new Date(request.timestamp), 'MMM d, h:mm a')}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-more-horizontal"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to={`/emergencies/${request.id}`} className="flex items-center w-full">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {request.status === 'pending' && (
              <DropdownMenuItem>
                <Link to={`/emergencies/${request.id}`} className="flex items-center w-full">
                  <Ambulance className="mr-2 h-4 w-4" />
                  Dispatch Ambulance
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href={`tel:${request.phone}`} className="flex items-center w-full">
                <PhoneOutgoing className="mr-2 h-4 w-4" />
                Call Patient
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default EmergencyTableRow;
