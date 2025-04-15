
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Ambulance, 
  ArrowUpDown, 
  PhoneOutgoing, 
  Clock, 
  MapPin, 
  PlusCircle,
  Search,
  Eye
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainLayout from '@/components/layout/MainLayout';
import { mockService } from '@/data/mockData';
import { EmergencyRequest } from '@/types';

const Emergencies = () => {
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<EmergencyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmergencyRequest['status'] | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof EmergencyRequest | 'location.address', direction: 'asc' | 'desc' }>({
    key: 'timestamp',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await mockService.getEmergencyRequests();
        setEmergencyRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (error) {
        console.error('Error fetching emergency requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...emergencyRequests];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(request => 
        request.name.toLowerCase().includes(query) ||
        request.phone.toLowerCase().includes(query) ||
        request.location.address.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'location.address') {
        aValue = a.location.address;
        bValue = b.location.address;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // For dates
      if (sortConfig.key === 'timestamp') {
        const aDate = new Date(a.timestamp).getTime();
        const bDate = new Date(b.timestamp).getTime();
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      return 0;
    });
    
    setFilteredRequests(result);
  }, [emergencyRequests, searchQuery, statusFilter, sortConfig]);

  const handleSort = (key: keyof EmergencyRequest | 'location.address') => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getStatusBadge = (status: EmergencyRequest['status']) => {
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading emergency requests...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Emergency Requests</h1>
            <p className="text-gray-500">Manage all emergency service requests</p>
          </div>
          <Button className="bg-purple-500 hover:bg-purple-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Manual Request
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Requests</CardTitle>
                <CardDescription>
                  {filteredRequests.length} total requests
                </CardDescription>
              </div>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        Patient
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('location.address')}
                      >
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('timestamp')}
                      >
                        Time
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No emergency requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Emergencies;
