import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doctor } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Form fields
  const [doctorId, setDoctorId] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [hospital, setHospital] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");

  // List of hospitals for dropdown
  const [hospitals, setHospitals] = useState([
    { id: "hospital1", name: "City General Hospital" },
    { id: "hospital2", name: "Medical Center" },
    { id: "hospital3", name: "Community Health Center" }
  ]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // For demonstration purposes, we'll create mock data
      const mockDoctors: Doctor[] = [
        {
          doctorId: "doc1",
          name: "Dr. Sarah Johnson",
          mobileNumber: "1234567890",
          dateOfBirth: "1980-05-15",
          hospital: "City General Hospital",
          speciality: "Cardiology",
          clinicHouseNumber: "123",
          clinicStreet: "Main Street",
          clinicVillage: "Downtown",
          clinicDistrict: "Central",
          clinicState: "California",
          clinicCountry: "USA",
          clinicPincode: "90001",
          password: "********"
        },
        {
          doctorId: "doc2",
          name: "Dr. Robert Miller",
          mobileNumber: "9876543210",
          dateOfBirth: "1975-08-22",
          hospital: "Medical Center",
          speciality: "Neurology",
          clinicHouseNumber: "456",
          clinicStreet: "Oak Avenue",
          clinicVillage: "Suburbia",
          clinicDistrict: "West",
          clinicState: "New York",
          clinicCountry: "USA",
          clinicPincode: "10001",
          password: "********"
        }
      ];
      
      setDoctors(mockDoctors);
      
      // In a real implementation, we would fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
        
      if (error) {
        toast({
          title: "Error fetching doctors",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setDoctors(data || []);
      */
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = () => {
    resetForm();
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDoctorId(doctor.doctorId);
    setName(doctor.name);
    setMobileNumber(doctor.mobileNumber);
    setDob(doctor.dateOfBirth);
    setHospital(doctor.hospital);
    setSpeciality(doctor.speciality);
    setClinicAddress(`${doctor.clinicHouseNumber} ${doctor.clinicStreet}, ${doctor.clinicVillage}, ${doctor.clinicDistrict}, ${doctor.clinicState}, ${doctor.clinicCountry}, ${doctor.clinicPincode}`);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    
    try {
      // In a real implementation, we would delete from Supabase
      // For now, we'll just update our local state
      const updatedDoctors = doctors.filter(doctor => doctor.doctorId !== doctorId);
      setDoctors(updatedDoctors);
      
      /* 
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId);
        
      if (error) throw error;
      */
      
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!name || !mobileNumber || !dob || !hospital || !speciality || !clinicAddress) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (dialogMode === 'create') {
        // Create new doctor
        const newDoctor: Doctor = {
          doctorId: `doc${Date.now()}`, // Generate a temporary ID
          name,
          mobileNumber,
          dateOfBirth: dob,
          hospital,
          speciality,
          clinicHouseNumber: "123", // Simplified for demo
          clinicStreet: "Street",
          clinicVillage: "Village",
          clinicDistrict: "District",
          clinicState: "State",
          clinicCountry: "Country",
          clinicPincode: "12345",
          password: "password"
        };
        
        setDoctors([...doctors, newDoctor]);
        
        /* 
        const { error } = await supabase
          .from('doctors')
          .insert([{ 
            name, 
            mobile_number: mobileNumber, 
            dob, 
            hospital, 
            speciality, 
            // ... other fields 
          }]);
          
        if (error) throw error;
        */
        
        toast({
          title: "Success",
          description: "Doctor created successfully",
        });
      } else {
        // Update existing doctor
        if (!selectedDoctor) return;
        
        const updatedDoctors = doctors.map(doctor => 
          doctor.doctorId === selectedDoctor.doctorId ? {
            ...doctor,
            name,
            mobileNumber,
            dateOfBirth: dob,
            hospital,
            speciality,
            // Update address fields would be handled properly in a real app
          } : doctor
        );
        
        setDoctors(updatedDoctors);
        
        /* 
        const { error } = await supabase
          .from('doctors')
          .update({ 
            name, 
            mobile_number: mobileNumber, 
            dob, 
            hospital, 
            speciality, 
            // ... other fields 
          })
          .eq('id', selectedDoctor.doctorId);
          
        if (error) throw error;
        */
        
        toast({
          title: "Success",
          description: "Doctor updated successfully",
        });
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast({
        title: "Error",
        description: "Failed to save doctor",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setDoctorId("");
    setName("");
    setMobileNumber("");
    setDob("");
    setHospital("");
    setSpeciality("");
    setClinicAddress("");
  };

  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Management</h1>
          <Button onClick={handleCreateDoctor}>Create New Doctor</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading doctors...</p>
            ) : doctors.length === 0 ? (
              <p>No doctors found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Speciality</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.doctorId}>
                      <TableCell>{doctor.doctorId}</TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.mobileNumber}</TableCell>
                      <TableCell>{doctor.speciality}</TableCell>
                      <TableCell>{doctor.hospital}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteDoctor(doctor.doctorId)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create New Doctor' : 'Edit Doctor'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 grid gap-4">
            {dialogMode === 'edit' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="doctorId" className="text-right text-sm font-medium">
                  Doctor ID
                </label>
                <Input 
                  id="doctorId" 
                  value={doctorId} 
                  className="col-span-3" 
                  disabled 
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter doctor's name" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="mobile" className="text-right text-sm font-medium">
                Mobile
              </label>
              <Input 
                id="mobile" 
                value={mobileNumber} 
                onChange={(e) => setMobileNumber(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter doctor's mobile number" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="dob" className="text-right text-sm font-medium">
                Date of Birth
              </label>
              <Input 
                id="dob" 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="speciality" className="text-right text-sm font-medium">
                Speciality
              </label>
              <Input 
                id="speciality" 
                value={speciality} 
                onChange={(e) => setSpeciality(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter doctor's speciality" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="hospital" className="text-right text-sm font-medium">
                Hospital
              </label>
              <Select 
                value={hospital} 
                onValueChange={setHospital}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map(hospital => (
                    <SelectItem key={hospital.id} value={hospital.name}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right text-sm font-medium">
                Clinic Address
              </label>
              <Input 
                id="address" 
                value={clinicAddress} 
                onChange={(e) => setClinicAddress(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter clinic address" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {dialogMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
};

export default Doctors;
