
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Ambulance, 
  PhoneCall, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  CircleX,
  Navigation,
  PhoneOutgoing
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import { mockService } from '@/data/mockData';
import { EmergencyRequest, Ambulance as AmbulanceType } from '@/types';

const Dashboard = () => {
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsData, ambulancesData] = await Promise.all([
          mockService.getEmergencyRequests(),
          mockService.getAmbulances()
        ]);
        setEmergencyRequests(requestsData);
        setAmbulances(ambulancesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRequests = emergencyRequests.filter(req => req.status === 'pending');
  const dispatchedRequests = emergencyRequests.filter(req => req.status === 'dispatched');
  const completedRequests = emergencyRequests.filter(req => req.status === 'completed');
  const cancelledRequests = emergencyRequests.filter(req => req.status === 'cancelled');

  const availableAmbulances = ambulances.filter(amb => amb.status === 'available');
  const dispatchedAmbulances = ambulances.filter(amb => amb.status === 'dispatched');
  const maintenanceAmbulances = ambulances.filter(amb => amb.status === 'maintenance');

  const getStatusColor = (status: EmergencyRequest['status']) => {
    switch (status) {
      case 'pending':
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
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Emergency service requests and ambulance status</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                  <h3 className="text-2xl font-bold mt-1">{pendingRequests.length}</h3>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <Progress value={pendingRequests.length > 0 ? 100 : 0} className="h-1 mt-3 bg-orange-100" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ambulances Available</p>
                  <h3 className="text-2xl font-bold mt-1">{availableAmbulances.length}</h3>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Ambulance className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <Progress 
                value={(availableAmbulances.length / ambulances.length) * 100} 
                className="h-1 mt-3 bg-green-100" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <h3 className="text-2xl font-bold mt-1">{dispatchedRequests.length}</h3>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <Progress value={dispatchedRequests.length > 0 ? 100 : 0} className="h-1 mt-3 bg-blue-100" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Today</p>
                  <h3 className="text-2xl font-bold mt-1">{completedRequests.length}</h3>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <Progress value={completedRequests.length > 0 ? 100 : 0} className="h-1 mt-3 bg-purple-100" />
            </CardContent>
          </Card>
        </div>

        {/* Emergency Requests Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Emergency Requests</CardTitle>
                  <CardDescription>
                    Emergency service requests from users
                  </CardDescription>
                </div>
                <Link to="/emergencies">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.length === 0 && dispatchedRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No active emergency requests at the moment</p>
                  </div>
                ) : (
                  [...pendingRequests, ...dispatchedRequests].slice(0, 5).map((request) => (
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <PhoneCall className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold">{emergencyRequests.length}</h3>
                <p className="text-sm text-gray-500 mt-1">Total Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Ambulance className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold">{ambulances.length}</h3>
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
                <h3 className="text-2xl font-bold">{completedRequests.length}</h3>
                <p className="text-sm text-gray-500 mt-1">Patients Served</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
