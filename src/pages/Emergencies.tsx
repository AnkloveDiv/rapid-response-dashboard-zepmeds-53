import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowUpDown } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { EmergencyRequest } from '@/types';
import AudioService from '@/services/AudioService';

import EmergencyFilter from '@/components/emergencies/EmergencyFilter';
import EmergencyTableRow from '@/components/emergencies/EmergencyTableRow';

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmergencyRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('emergency_requests')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          throw error;
        }

        const transformedData: EmergencyRequest[] = data.map(item => {
          const locationData = typeof item.location === 'string' 
            ? JSON.parse(item.location) 
            : item.location;
            
          return {
            id: item.id,
            name: item.name,
            phone: item.phone,
            timestamp: item.timestamp,
            location: {
              address: locationData.address || '',
              coordinates: {
                latitude: locationData.coordinates?.latitude || 0,
                longitude: locationData.coordinates?.longitude || 0
              }
            },
            status: item.status as EmergencyRequest['status'],
            notes: item.notes || undefined,
            ambulanceId: item.ambulance_id || undefined
          };
        });

        setEmergencyRequests(transformedData);
      } catch (error) {
        console.error('Error fetching emergency requests:', error);
        toast({
          title: "Error",
          description: "Failed to load emergency requests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyRequests();

    const channel = supabase
      .channel('public:emergency_requests')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'emergency_requests' 
        }, 
        (payload) => {
          console.log('New emergency request received:', payload);
          
          const locationData = typeof payload.new.location === 'string' 
            ? JSON.parse(payload.new.location) 
            : payload.new.location;
          
          const newRequest: EmergencyRequest = {
            id: payload.new.id,
            name: payload.new.name,
            phone: payload.new.phone,
            timestamp: payload.new.timestamp,
            location: {
              address: locationData.address || '',
              coordinates: {
                latitude: locationData.coordinates?.latitude || 0,
                longitude: locationData.coordinates?.longitude || 0
              }
            },
            status: payload.new.status as EmergencyRequest['status'],
            notes: payload.new.notes || undefined,
            ambulanceId: payload.new.ambulance_id || undefined
          };
          
          AudioService.playEmergencyAlert(5);
          
          setEmergencyRequests(prevRequests => [newRequest, ...prevRequests]);
          
          toast({
            title: "New Emergency Request",
            description: `${newRequest.name} is requesting emergency assistance`,
            variant: "default",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  useEffect(() => {
    let result = [...emergencyRequests];
    
    if (statusFilter !== 'all') {
      result = result.filter(request => request.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(request => 
        request.name.toLowerCase().includes(query) ||
        request.phone.toLowerCase().includes(query) ||
        request.location.address.toLowerCase().includes(query)
      );
    }
    
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

  const createEmergencyRequest = async () => {
    try {
      const testRequest = {
        name: "Test Patient",
        phone: "+1234567890",
        location: {
          address: "123 Test Street, Test City",
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194
          }
        }
      };

      const { data, error } = await supabase
        .from('emergency_requests')
        .insert(testRequest)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Test Request Created",
        description: "A test emergency request has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error creating test emergency request:', error);
      toast({
        title: "Error",
        description: "Failed to create test emergency request.",
        variant: "destructive",
      });
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
          <div className="flex gap-2">
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={createEmergencyRequest}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Test Request
            </Button>
          </div>
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
              <EmergencyFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
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
                      <EmergencyTableRow key={request.id} request={request} />
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
