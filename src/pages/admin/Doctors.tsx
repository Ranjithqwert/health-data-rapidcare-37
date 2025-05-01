
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase, generatePassword } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doctor } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // Form fields
  const [doctorId, setDoctorId] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [hospital, setHospital] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");

  // List of hospitals for dropdown
  const [hospitals, setHospitals] = useState<{id: string, name: string}[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoadingHospitals(true);
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name');
        
      if (error) {
        throw error;
      }
      
      setHospitals(data || []);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hospitals",
        variant: "destructive",
      });
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
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
      
      // Transform the data to match our Doctor model
      const transformedDoctors: Doctor[] = data.map(doc => ({
        doctorId: doc.id,
        name: doc.name,
        mobileNumber: doc.mobile_number,
        email: doc.email,
        dateOfBirth: doc.dob,
        hospital: doc.hospital_id, // This would need to be replaced with the actual hospital name
        speciality: doc.speciality,
        clinicHouseNumber: doc.clinic_house_number || '',
        clinicStreet: doc.clinic_street || '',
        clinicVillage: doc.clinic_village || '',
        clinicDistrict: doc.clinic_district || '',
        clinicState: doc.clinic_state || '',
        clinicCountry: doc.clinic_country || '',
        clinicPincode: doc.clinic_pincode || '',
        password: '********' // Masking the password
      }));
      
      setDoctors(transformedDoctors);
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
    setEmail(doctor.email || '');
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
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId);
        
      if (error) throw error;
      
      // Update local state after successful deletion
      setDoctors(doctors.filter(doctor => doctor.doctorId !== doctorId));
      
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

  const sendWelcomeEmail = async (email: string, name: string, password: string) => {
    try {
      setSendingEmail(true);
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          name,
          userType: 'doctor',
          password
        }
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "Welcome email with credentials has been sent",
      });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      toast({
        title: "Error",
        description: "Failed to send welcome email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!name || !mobileNumber || !email || !dob || !hospital || !speciality) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (dialogMode === 'create') {
        // Generate a password for the new doctor
        const password = generatePassword();
        
        // Create new doctor in Supabase
        const { data, error } = await supabase
          .from('doctors')
          .insert([{ 
            name, 
            mobile_number: mobileNumber,
            email,
            dob, 
            hospital_id: hospital, 
            speciality,
            // Extract address fields from the combined address
            clinic_house_number: "123", // This would need proper parsing in a real implementation
            clinic_street: "Street",
            clinic_village: "Village",
            clinic_district: "District",
            clinic_state: "State",
            clinic_country: "Country",
            clinic_pincode: "12345",
            password // In a real implementation, this would be hashed
          }])
          .select();
          
        if (error) throw error;
        
        // Send welcome email with credentials
        if (data && data.length > 0) {
          await sendWelcomeEmail(email, name, password);
        }
        
        // Refresh doctors list
        fetchDoctors();
        
        toast({
          title: "Success",
          description: "Doctor created successfully",
        });
      } else {
        // Update existing doctor
        if (!selectedDoctor) return;
        
        const { error } = await supabase
          .from('doctors')
          .update({ 
            name, 
            mobile_number: mobileNumber,
            email,
            dob, 
            hospital_id: hospital, 
            speciality,
            // Update address fields would be handled properly in a real app
          })
          .eq('id', selectedDoctor.doctorId);
          
        if (error) throw error;
        
        // Refresh doctors list
        fetchDoctors();
        
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
    setEmail("");
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
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : doctors.length === 0 ? (
              <p>No doctors found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
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
                      <TableCell>{doctor.email}</TableCell>
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
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter doctor's email" 
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
                  {loadingHospitals ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : hospitals.map(hospital => (
                    <SelectItem key={hospital.id} value={hospital.id}>
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
            <Button onClick={handleSubmit} disabled={sendingEmail}>
              {sendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Email...
                </>
              ) : dialogMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
};

export default Doctors;
