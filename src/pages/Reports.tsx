
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  FileText, 
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Calendar,
  FileBarChart,
  UserCheck
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { EmergencyRequest, Ambulance } from '@/types';

interface Report {
  id: string;
  title: string;
  description?: string;
  emergency_id?: string;
  ambulance_id?: string;
  report_date: string;
  created_at?: string;
  emergency?: EmergencyRequest;
  ambulance?: Ambulance;
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    emergency_id: '',
    ambulance_id: '',
    report_date: format(new Date(), 'yyyy-MM-dd')
  });
  const { toast } = useToast();

  // Fetch reports and associated data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reports
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .order('report_date', { ascending: false });

        if (reportError) throw reportError;

        // Fetch emergencies
        const { data: emergencyData, error: emergencyError } = await supabase
          .from('emergency_requests')
          .select('*');

        if (emergencyError) throw emergencyError;

        // Fetch ambulances
        const { data: ambulanceData, error: ambulanceError } = await supabase
          .from('ambulances')
          .select('*');

        if (ambulanceError) throw ambulanceError;

        // Transform emergency data
        const transformedEmergencies: EmergencyRequest[] = emergencyData.map(item => {
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

        // Transform ambulance data
        const transformedAmbulances: Ambulance[] = ambulanceData.map(item => ({
          id: item.id,
          name: item.name,
          vehicleNumber: item.vehicle_number,
          driver: {
            name: item.driver_name,
            phone: item.driver_phone
          },
          status: item.status as Ambulance['status'],
          lastLocation: item.last_latitude && item.last_longitude ? {
            latitude: Number(item.last_latitude),
            longitude: Number(item.last_longitude),
            timestamp: item.last_updated || new Date().toISOString()
          } : undefined
        }));

        // Associate emergency and ambulance data with reports
        const enrichedReports = reportData.map((report: Report) => {
          const emergency = transformedEmergencies.find(e => e.id === report.emergency_id);
          const ambulance = transformedAmbulances.find(a => a.id === report.ambulance_id);
          
          return {
            ...report,
            emergency,
            ambulance
          };
        });

        setReports(enrichedReports);
        setEmergencies(transformedEmergencies);
        setAmbulances(transformedAmbulances);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription for reports
    const channel = supabase
      .channel('public:reports')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports' 
        }, 
        (payload) => {
          console.log('Report update received:', payload);
          
          // Re-fetch all data to ensure everything is up to date
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Filter reports based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReports(reports);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = reports.filter(report => 
        report.title.toLowerCase().includes(query) ||
        (report.description && report.description.toLowerCase().includes(query)) ||
        (report.emergency && report.emergency.name.toLowerCase().includes(query)) ||
        (report.ambulance && report.ambulance.name.toLowerCase().includes(query))
      );
      setFilteredReports(filtered);
    }
  }, [reports, searchQuery]);

  const handleAddReport = async () => {
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          title: newReport.title,
          description: newReport.description || null,
          emergency_id: newReport.emergency_id || null,
          ambulance_id: newReport.ambulance_id || null,
          report_date: newReport.report_date
        });

      if (error) {
        throw error;
      }

      // Reset form
      setNewReport({
        title: '',
        description: '',
        emergency_id: '',
        ambulance_id: '',
        report_date: format(new Date(), 'yyyy-MM-dd')
      });

      // Close dialog
      setIsAddDialogOpen(false);

      toast({
        title: "Success",
        description: "Report added successfully",
      });
    } catch (error) {
      console.error('Error adding report:', error);
      toast({
        title: "Error",
        description: "Failed to add report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setNewReport({
      title: report.title,
      description: report.description || '',
      emergency_id: report.emergency_id || '',
      ambulance_id: report.ambulance_id || '',
      report_date: report.report_date
    });
    setDate(new Date(report.report_date));
    setIsEditDialogOpen(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport) return;

    try {
      const { error } = await supabase
        .from('reports')
        .update({
          title: newReport.title,
          description: newReport.description || null,
          emergency_id: newReport.emergency_id || null,
          ambulance_id: newReport.ambulance_id || null,
          report_date: newReport.report_date
        })
        .eq('id', selectedReport.id);

      if (error) {
        throw error;
      }

      // Reset form and close dialog
      setSelectedReport(null);
      setIsEditDialogOpen(false);

      toast({
        title: "Success",
        description: "Report updated successfully",
      });
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
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
            <p className="mt-4 text-gray-600">Loading reports...</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-gray-500">Manage and create incident reports</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Enter the details for the new report.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                    id="title"
                    className="col-span-3"
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                    placeholder="Report Title"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="report-date" className="text-right">Date</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            if (newDate) {
                              setDate(newDate);
                              setNewReport({
                                ...newReport,
                                report_date: format(newDate, 'yyyy-MM-dd')
                              });
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emergency" className="text-right">Emergency</Label>
                  <Select
                    value={newReport.emergency_id}
                    onValueChange={(value) => setNewReport({...newReport, emergency_id: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select emergency (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {emergencies.map(emergency => (
                        <SelectItem key={emergency.id} value={emergency.id}>
                          {emergency.name} - {format(new Date(emergency.timestamp), 'PPP')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ambulance" className="text-right">Ambulance</Label>
                  <Select
                    value={newReport.ambulance_id}
                    onValueChange={(value) => setNewReport({...newReport, ambulance_id: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select ambulance (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {ambulances.map(ambulance => (
                        <SelectItem key={ambulance.id} value={ambulance.id}>
                          {ambulance.name} - {ambulance.vehicleNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    rows={4}
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    placeholder="Report details..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={handleAddReport}
                  disabled={!newReport.title}
                >
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Report Records</CardTitle>
                <CardDescription>
                  {filteredReports.length} reports
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Related To</TableHead>
                    <TableHead>Ambulance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                              <FileBarChart className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                              <p className="font-medium">{report.title}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3 text-gray-500" />
                            {format(new Date(report.report_date), 'PPP')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.emergency ? (
                            <div className="flex items-center space-x-2">
                              <UserCheck className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{report.emergency.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {report.ambulance ? (
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{report.ambulance.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditReport(report)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteReport(report.id)}
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

      {/* Edit Report Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>
              Update report information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <Input
                id="edit-title"
                className="col-span-3"
                value={newReport.title}
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-report-date" className="text-right">Date</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          setNewReport({
                            ...newReport,
                            report_date: format(newDate, 'yyyy-MM-dd')
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-emergency" className="text-right">Emergency</Label>
              <Select
                value={newReport.emergency_id}
                onValueChange={(value) => setNewReport({...newReport, emergency_id: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select emergency (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {emergencies.map(emergency => (
                    <SelectItem key={emergency.id} value={emergency.id}>
                      {emergency.name} - {format(new Date(emergency.timestamp), 'PPP')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ambulance" className="text-right">Ambulance</Label>
              <Select
                value={newReport.ambulance_id}
                onValueChange={(value) => setNewReport({...newReport, ambulance_id: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select ambulance (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {ambulances.map(ambulance => (
                    <SelectItem key={ambulance.id} value={ambulance.id}>
                      {ambulance.name} - {ambulance.vehicleNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">Description</Label>
              <Textarea
                id="edit-description"
                className="col-span-3"
                rows={4}
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={handleUpdateReport}
              disabled={!newReport.title}
            >
              Update Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Reports;
