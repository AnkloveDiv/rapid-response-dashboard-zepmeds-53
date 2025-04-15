
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  Clipboard, 
  Send, 
  Navigation,
  AlertCircle,
  CheckCircle,
  X,
  ArrowLeft
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { EmergencyRequest, Ambulance } from '@/types';
import MapView from '@/components/MapView';

const EmergencyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emergency, setEmergency] = useState<EmergencyRequest | null>(null);
  const [availableAmbulances, setAvailableAmbulances] = useState<Ambulance[]>([]);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'dispatch' | 'complete' | 'cancel' | null>(null);

  useEffect(() => {
    const fetchEmergencyData = async () => {
      if (!id) return;
      
      try {
        // Fetch emergency request details
        const { data: emergencyData, error: emergencyError } = await supabase
          .from('emergency_requests')
          .select('*')
          .eq('id', id)
          .single();

        if (emergencyError) {
          throw emergencyError;
        }

        // Transform Supabase data to match our EmergencyRequest type
        const transformedEmergency: EmergencyRequest = {
          id: emergencyData.id,
          name: emergencyData.name,
          phone: emergencyData.phone,
          timestamp: emergencyData.timestamp,
          location: emergencyData.location,
          status: emergencyData.status,
          notes: emergencyData.notes || undefined,
          ambulanceId: emergencyData.ambulance_id || undefined
        };

        setEmergency(transformedEmergency);
        
        if (emergencyData.notes) {
          setNotes(emergencyData.notes);
        }

        // Get available ambulances (This is mock data for now)
        // In a real implementation, we would fetch this from a 'ambulances' table in Supabase
        const mockAmbulances: Ambulance[] = [
          {
            id: '1',
            name: 'Ambulance A',
            vehicleNumber: 'ZEP-001',
            driver: {
              name: 'John Driver',
              phone: '+12345678901'
            },
            status: 'available'
          },
          {
            id: '2',
            name: 'Ambulance B',
            vehicleNumber: 'ZEP-002',
            driver: {
              name: 'Sarah Medic',
              phone: '+12345678902'
            },
            status: 'available'
          },
          {
            id: '3',
            name: 'Ambulance C',
            vehicleNumber: 'ZEP-003',
            driver: {
              name: 'Mike Rescue',
              phone: '+12345678903'
            },
            status: 'available'
          }
        ];

        setAvailableAmbulances(mockAmbulances);
      } catch (error) {
        console.error('Error fetching emergency details:', error);
        toast({
          title: "Error",
          description: "Failed to load emergency details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyData();
  }, [id, toast]);

  const updateEmergencyStatus = async (status: EmergencyRequest['status'], ambulanceId?: string) => {
    if (!emergency || !id) return;
    
    try {
      const updateData: any = { 
        status,
        notes,
        updated_at: new Date().toISOString()
      };

      if (ambulanceId) {
        updateData.ambulance_id = ambulanceId;
      }

      const { data, error } = await supabase
        .from('emergency_requests')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Transform updated data
      const updatedEmergency: EmergencyRequest = {
        ...emergency,
        status: status,
        notes: notes,
        ambulanceId: ambulanceId || emergency.ambulanceId
      };

      setEmergency(updatedEmergency);
      
      toast({
        title: "Request Updated",
        description: `Emergency request has been ${status}.`,
        variant: "default",
      });
    } catch (error) {
      console.error(`Error updating emergency request to ${status}:`, error);
      toast({
        title: "Error",
        description: `Failed to update emergency status to ${status}.`,
        variant: "destructive",
      });
    }
  };

  const handleDispatch = async () => {
    if (!emergency || !selectedAmbulanceId) return;
    
    setIsSubmitting(true);
    try {
      await updateEmergencyStatus('dispatched', selectedAmbulanceId);
      setConfirmDialog(false);
    } catch (error) {
      console.error('Error dispatching ambulance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!emergency) return;
    
    setIsSubmitting(true);
    try {
      await updateEmergencyStatus('completed');
      setConfirmDialog(false);
    } catch (error) {
      console.error('Error completing request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!emergency) return;
    
    setIsSubmitting(true);
    try {
      await updateEmergencyStatus('cancelled');
      setConfirmDialog(false);
    } catch (error) {
      console.error('Error cancelling request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!emergency || !id) return;
    
    try {
      const { error } = await supabase
        .from('emergency_requests')
        .update({ notes })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Notes Saved",
        description: "Emergency request notes have been updated.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes.",
        variant: "destructive",
      });
    }
  };

  const openMapsNavigation = () => {
    if (!emergency) return;
    
    const { latitude, longitude } = emergency.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
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

  const handleConfirmAction = (action: 'dispatch' | 'complete' | 'cancel') => {
    setActionType(action);
    setConfirmDialog(true);
  };

  const executeAction = () => {
    switch (actionType) {
      case 'dispatch':
        handleDispatch();
        break;
      case 'complete':
        handleComplete();
        break;
      case 'cancel':
        handleCancel();
        break;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading emergency details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!emergency) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Emergency request not found. It may have been deleted or the ID is incorrect.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate('/emergencies')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Emergency Requests
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Emergency Request Details</h1>
            <p className="text-gray-500">Manage emergency response</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Patient Details
                      {getStatusBadge(emergency.status)}
                    </CardTitle>
                    <CardDescription>Patient information and emergency details</CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    ID: {emergency.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        Name
                      </div>
                      <div className="font-medium">{emergency.name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        Phone Number
                      </div>
                      <div className="font-medium flex items-center gap-2">
                        {emergency.phone}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => window.open(`tel:${emergency.phone}`, '_blank')}
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      Location
                    </div>
                    <div className="font-medium">{emergency.location.address}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      Requested At
                    </div>
                    <div className="font-medium">
                      {format(new Date(emergency.timestamp), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>

                  {emergency.notes && (
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <Clipboard className="h-4 w-4 mr-2 text-gray-400" />
                        Notes
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md text-sm">
                        {emergency.notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Location Map</CardTitle>
                <CardDescription>Patient's current location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full rounded-md overflow-hidden border border-gray-200">
                  <MapView 
                    latitude={emergency.location.coordinates.latitude} 
                    longitude={emergency.location.coordinates.longitude} 
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
                  onClick={openMapsNavigation}
                >
                  <Navigation className="h-4 w-4" />
                  Navigate to Patient
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Status and Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Status</CardTitle>
                <CardDescription>
                  {emergency.status === 'pending' && 'This emergency needs an ambulance dispatched.'}
                  {emergency.status === 'dispatched' && 'An ambulance has been dispatched.'}
                  {emergency.status === 'completed' && 'This emergency has been resolved.'}
                  {emergency.status === 'cancelled' && 'This emergency was cancelled.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergency.status === 'pending' && (
                    <div className="space-y-4">
                      <Alert className="bg-orange-50 text-orange-800 border-orange-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Pending Request</AlertTitle>
                        <AlertDescription>
                          This emergency request is waiting for an ambulance to be dispatched.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ambulance">Select Ambulance</Label>
                        <Select 
                          value={selectedAmbulanceId} 
                          onValueChange={setSelectedAmbulanceId}
                        >
                          <SelectTrigger id="ambulance">
                            <SelectValue placeholder="Select an ambulance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Available Ambulances</SelectLabel>
                              {availableAmbulances.map((ambulance) => (
                                <SelectItem key={ambulance.id} value={ambulance.id}>
                                  {ambulance.name} ({ambulance.vehicleNumber})
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {emergency.status === 'dispatched' && (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                      <Navigation className="h-4 w-4" />
                      <AlertTitle>Ambulance Dispatched</AlertTitle>
                      <AlertDescription>
                        Ambulance is on the way to the patient's location.
                      </AlertDescription>
                    </Alert>
                  )}

                  {emergency.status === 'completed' && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Emergency Completed</AlertTitle>
                      <AlertDescription>
                        This emergency has been successfully resolved.
                      </AlertDescription>
                    </Alert>
                  )}

                  {emergency.status === 'cancelled' && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <X className="h-4 w-4" />
                      <AlertTitle>Emergency Cancelled</AlertTitle>
                      <AlertDescription>
                        This emergency request was cancelled.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add additional information about this emergency"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      disabled={emergency.status === 'completed' || emergency.status === 'cancelled'}
                    />
                    {(emergency.status === 'pending' || emergency.status === 'dispatched') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={handleSaveNotes}
                      >
                        Save Notes
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 border-t pt-6">
                {emergency.status === 'pending' && (
                  <>
                    <Button
                      className="w-full bg-purple-500 hover:bg-purple-600 flex items-center"
                      disabled={!selectedAmbulanceId || isSubmitting}
                      onClick={() => handleConfirmAction('dispatch')}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Dispatch Ambulance
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleConfirmAction('cancel')}
                    >
                      Cancel Request
                    </Button>
                  </>
                )}

                {emergency.status === 'dispatched' && (
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => handleConfirmAction('complete')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Contact Information */}
            {emergency.status === 'dispatched' && emergency.ambulanceId && (
              <Card>
                <CardHeader>
                  <CardTitle>Ambulance Details</CardTitle>
                  <CardDescription>
                    Information about the dispatched ambulance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableAmbulances.map(amb => 
                      amb.id === emergency.ambulanceId ? (
                        <div key={amb.id} className="space-y-3">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-500">Ambulance</div>
                            <div className="font-medium">{amb.name} ({amb.vehicleNumber})</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-500">Driver</div>
                            <div className="font-medium">{amb.driver.name}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-500">Contact</div>
                            <div className="font-medium flex items-center gap-2">
                              {amb.driver.phone}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={() => window.open(`tel:${amb.driver.phone}`, '_blank')}
                              >
                                Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'dispatch' && 'Dispatch Ambulance'}
              {actionType === 'complete' && 'Complete Emergency'}
              {actionType === 'cancel' && 'Cancel Emergency'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'dispatch' && 'Are you sure you want to dispatch an ambulance to this location?'}
              {actionType === 'complete' && 'Are you sure you want to mark this emergency as completed?'}
              {actionType === 'cancel' && 'Are you sure you want to cancel this emergency request?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button 
              onClick={executeAction}
              disabled={isSubmitting}
              className={
                actionType === 'dispatch' ? 'bg-purple-500 hover:bg-purple-600' :
                actionType === 'complete' ? 'bg-green-500 hover:bg-green-600' :
                'bg-red-500 hover:bg-red-600'
              }
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EmergencyDetails;
