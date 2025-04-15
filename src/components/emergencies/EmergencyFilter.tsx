
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmergencyRequest } from '@/types';

interface EmergencyFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: EmergencyRequest['status'] | 'all';
  setStatusFilter: (status: EmergencyRequest['status'] | 'all') => void;
}

const EmergencyFilter: React.FC<EmergencyFilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search requests..."
          className="pl-9 w-full sm:w-[250px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value as EmergencyRequest['status'] | 'all')}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmergencyFilter;
