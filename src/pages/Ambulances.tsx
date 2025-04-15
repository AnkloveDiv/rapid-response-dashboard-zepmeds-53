
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Ambulance, 
  MapPin, 
  Phone, 
  Clock, 
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle, 
  WrenchIcon
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Ambulance as AmbulanceType } from '@/types';

const Ambulances = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>([]);
  const [filteredAmbulances, setFilteredAmbulances] = useState<AmbulanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AmbulanceType['status'] | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAmbulance, setNewAmbulance] = useState({
    name: '',
    vehicleNumber: '',
    driver: {
      name: '',
      phone: ''
    },
    status: 'available' as AmbulanceType['status']
  });
  const { toast } = useToast();

  // Fetch ambulances from Supabase
  useEffect(() => {
    const fetchAmbulances = async () => {
      try {
        const { data, error } = await supabase
          .from('ambulances')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        const transformedData: AmbulanceType[] = data.map(item => ({
          id: item.id,
          name: item.name,
          vehicleNumber: item.vehicle_number,
          driver: {
            name: item.driver_name,
            phone: item.driver_phone
          },
          status: item.status as AmbulanceType['status'],
          lastLocation: item.last_latitude && item.last_longitude ? {
            latitude: Number(item.last_latitude),
            longitude: Number(item.last_longitude),
            timestamp: item.last_updated || new Date().toISOString()
          } : undefined
        }));

        setAmbulances(transformedData);
      } catch (error) {
        console.error('Error fetching ambulances:', error);
        toast({
          title: "Error",
          description: "Failed to load ambulances. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmbulances();

    // Set up real-time subscription for ambulances
    const channel = supabase
      .channel('public:ambulances')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'ambulances' 
        }, 
        (payload) => {
          console.log('Ambulance update received:', payload);
          
          // Re-fetch the ambulances to get the latest data
          fetchAmbulances();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Filter ambulances based on search query and status filter
  useEffect(() => {
    let result = [...ambulances];
    
    if (statusFilter !== 'all') {
      result = result.filter(ambulance => ambulance.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ambulance => 
        ambulance.name.toLowerCase().includes(query) ||
        ambulance.vehicleNumber.toLowerCase().includes(query) ||
        ambulance.driver.name.toLowerCase().includes(query) ||
        ambulance.driver.phone.toLowerCase().includes(query)
      );
    }
    
    setFilteredAmbulances(result);
  }, [ambulances, searchQuery, statusFilter]);

  const getStatusBadge = (status: AmbulanceType['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'dispatched':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Dispatched</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: AmbulanceType['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'dispatched':
        return <Ambulance className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <WrenchIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const handleAddAmbulance = async () => {
    try {
      const { error } = await supabase
        .from('ambulances')
        .insert({
          name: newAmbulance.name,
          vehicle_number: newAmbulance.vehicleNumber,
          driver_name: newAmbulance.driver.name,
          driver_phone: newAmbulance.driver.phone,
          status: newAmbulance.status
        });

      if (error) {
        throw error;
      }

      // Reset form
      setNewAmbulance({
        name: '',
        vehicleNumber: '',
        driver: {
          name: '',
          phone: ''
        },
        status: 'available'
      });

      // Close dialog
      setIsAddDialogOpen(false);

      toast({
        title: "Success",
        description: "Ambulance added successfully",
      });
    } catch (error) {
      console.error('Error adding ambulance:', error);
      toast({
        title: "Error",
        description: "Failed to add ambulance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: AmbulanceType['status']) => {
    try {
      const { error } = await supabase
        .from('ambulances')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Ambulance status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating ambulance status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAmbulance = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ambulance?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ambulances')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Deleted",
        description: "Ambulance has been removed",
      });
    } catch (error) {
      console.error('Error deleting ambulance:', error);
      toast({
        title: "Error",
        description: "Failed to delete ambulance. Please try again.",
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
            <p className="mt-4 text-gray-600">Loading ambulances...</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Ambulances</h1>
            <p className="text-gray-500">Manage your fleet of emergency vehicles</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Ambulance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Ambulance</DialogTitle>
                <DialogDescription>
                  Enter the details of the new ambulance to add to your fleet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amb-name" className="text-right">Name</Label>
                  <Input
                    id="amb-name"
                    className="col-span-3"
                    value={newAmbulance.name}
                    onChange={(e) => setNewAmbulance({...newAmbulance, name: e.target.value})}
                    placeholder="Ambulance 1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicle-number" className="text-right">Vehicle Number</Label>
                  <Input
                    id="vehicle-number"
                    className="col-span-3"
                    value={newAmbulance.vehicleNumber}
                    onChange={(e) => setNewAmbulance({...newAmbulance, vehicleNumber: e.target.value})}
                    placeholder="ZP-AMB-001"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="driver-name" className="text-right">Driver Name</Label>
                  <Input
                    id="driver-name"
                    className="col-span-3"
                    value={newAmbulance.driver.name}
                    onChange={(e) => setNewAmbulance({
                      ...newAmbulance, 
                      driver: {...newAmbulance.driver, name: e.target.value}
                    })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="driver-phone" className="text-right">Driver Phone</Label>
                  <Input
                    id="driver-phone"
                    className="col-span-3"
                    value={newAmbulance.driver.phone}
                    onChange={(e) => setNewAmbulance({
                      ...newAmbulance, 
                      driver: {...newAmbulance.driver, phone: e.target.value}
                    })}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={newAmbulance.status}
                    onValueChange={(value) => setNewAmbulance({
                      ...newAmbulance, 
                      status: value as AmbulanceType['status']
                    })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={handleAddAmbulance}
                  disabled={!newAmbulance.name || !newAmbulance.vehicleNumber || !newAmbulance.driver.name || !newAmbulance.driver.phone}
                >
                  Add Ambulance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Fleet Management</CardTitle>
                <CardDescription>
                  {filteredAmbulances.length} ambulances in your fleet
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search ambulances..."
                    className="pl-9 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as AmbulanceType['status'] | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
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
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Ambulance</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Last Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAmbulances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No ambulances found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAmbulances.map((ambulance) => (
                      <TableRow key={ambulance.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(ambulance.status)}
                            <span className="ml-2">{getStatusBadge(ambulance.status)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium">{ambulance.name}</div>
                            <div className="text-sm text-gray-500">{ambulance.vehicleNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium">{ambulance.driver.name}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="mr-1 h-3 w-3" />
                              {ambulance.driver.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ambulance.lastLocation ? (
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm">
                                <MapPin className="mr-1 h-3 w-3 text-gray-500" />
                                <span>{ambulance.lastLocation.latitude.toFixed(4)}, {ambulance.lastLocation.longitude.toFixed(4)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="mr-1 h-3 w-3" />
                                {format(new Date(ambulance.lastLocation.timestamp), 'MMM d, h:mm a')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Location not available</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Select
                              value={ambulance.status}
                              onValueChange={(value) => handleUpdateStatus(ambulance.id, value as AmbulanceType['status'])}
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="dispatched">Dispatched</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteAmbulance(ambulance.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

export default Ambulances;
