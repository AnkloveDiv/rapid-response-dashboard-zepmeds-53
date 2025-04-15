
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  PlusCircle,
  Edit,
  Trash2,
  FileText,
  Search
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';

interface Patient {
  id: string;
  name: string;
  phone: string;
  address?: string;
  medical_notes?: string;
  emergency_contact?: string;
  created_at?: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    address: '',
    medical_notes: '',
    emergency_contact: ''
  });
  const { toast } = useToast();

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();

    // Set up real-time subscription for patients
    const channel = supabase
      .channel('public:patients')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'patients' 
        }, 
        (payload) => {
          console.log('Patient update received:', payload);
          
          // Re-fetch the patients to get the latest data
          fetchPatients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query) ||
        (patient.address && patient.address.toLowerCase().includes(query)) ||
        (patient.emergency_contact && patient.emergency_contact.toLowerCase().includes(query))
      );
      setFilteredPatients(filtered);
    }
  }, [patients, searchQuery]);

  const handleAddPatient = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .insert({
          name: newPatient.name,
          phone: newPatient.phone,
          address: newPatient.address || null,
          medical_notes: newPatient.medical_notes || null,
          emergency_contact: newPatient.emergency_contact || null
        });

      if (error) {
        throw error;
      }

      // Reset form
      setNewPatient({
        name: '',
        phone: '',
        address: '',
        medical_notes: '',
        emergency_contact: ''
      });

      // Close dialog
      setIsAddDialogOpen(false);

      toast({
        title: "Success",
        description: "Patient added successfully",
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setNewPatient({
      name: patient.name,
      phone: patient.phone,
      address: patient.address || '',
      medical_notes: patient.medical_notes || '',
      emergency_contact: patient.emergency_contact || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = async () => {
    if (!selectedPatient) return;

    try {
      const { error } = await supabase
        .from('patients')
        .update({
          name: newPatient.name,
          phone: newPatient.phone,
          address: newPatient.address || null,
          medical_notes: newPatient.medical_notes || null,
          emergency_contact: newPatient.emergency_contact || null
        })
        .eq('id', selectedPatient.id);

      if (error) {
        throw error;
      }

      // Reset form and close dialog
      setSelectedPatient(null);
      setIsEditDialogOpen(false);

      toast({
        title: "Success",
        description: "Patient updated successfully",
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient. Please try again.",
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
            <p className="mt-4 text-gray-600">Loading patients...</p>
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
            <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
            <p className="text-gray-500">Manage patient information and medical history</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input
                    id="phone"
                    className="col-span-3"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input
                    id="address"
                    className="col-span-3"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emergency-contact" className="text-right">Emergency Contact</Label>
                  <Input
                    id="emergency-contact"
                    className="col-span-3"
                    value={newPatient.emergency_contact}
                    onChange={(e) => setNewPatient({...newPatient, emergency_contact: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="medical-notes" className="text-right pt-2">Medical Notes</Label>
                  <Textarea
                    id="medical-notes"
                    className="col-span-3"
                    rows={4}
                    value={newPatient.medical_notes}
                    onChange={(e) => setNewPatient({...newPatient, medical_notes: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={handleAddPatient}
                  disabled={!newPatient.name || !newPatient.phone}
                >
                  Add Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>
                  {filteredPatients.length} patients
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search patients..."
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
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Emergency Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No patients found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                              <User className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3 text-gray-500" />
                            {patient.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{patient.address || 'Not provided'}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{patient.emergency_contact || 'Not provided'}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditPatient(patient)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => handleDeletePatient(patient.id)}
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

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update patient information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">Phone</Label>
              <Input
                id="edit-phone"
                className="col-span-3"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">Address</Label>
              <Input
                id="edit-address"
                className="col-span-3"
                value={newPatient.address}
                onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-emergency-contact" className="text-right">Emergency Contact</Label>
              <Input
                id="edit-emergency-contact"
                className="col-span-3"
                value={newPatient.emergency_contact}
                onChange={(e) => setNewPatient({...newPatient, emergency_contact: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-medical-notes" className="text-right pt-2">Medical Notes</Label>
              <Textarea
                id="edit-medical-notes"
                className="col-span-3"
                rows={4}
                value={newPatient.medical_notes}
                onChange={(e) => setNewPatient({...newPatient, medical_notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={handleUpdatePatient}
              disabled={!newPatient.name || !newPatient.phone}
            >
              Update Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Patients;
