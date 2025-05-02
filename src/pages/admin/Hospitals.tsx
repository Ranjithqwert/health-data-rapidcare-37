import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase, generatePassword } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hospital } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // Form fields
  const [hospitalId, setHospitalId] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobile, setMobile] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<"general" | "specialty">("general");
  const [speciality, setSpeciality] = useState("");
  const [numberOfICUs, setNumberOfICUs] = useState(0);
  const [numberOfOPRooms, setNumberOfOPRooms] = useState(0);
  const [numberOfDoctors, setNumberOfDoctors] = useState(0);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      
      // Real implementation using Supabase
      const { data, error } = await supabase
        .from('hospitals')
        .select('*');
        
      if (error) {
        toast({
          title: "Error fetching hospitals",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Transform the data to match our Hospital model
      const transformedHospitals: Hospital[] = data.map(hospital => ({
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        emailId: hospital.email,
        mobile: hospital.mobile,
        hospitalLicenseNumber: hospital.license_number || '',
        hospitalHouseNumber: hospital.house_number || '',
        hospitalStreet: hospital.street || '',
        hospitalVillage: hospital.village || '',
        hospitalDistrict: hospital.district || '',
        hospitalState: hospital.state || '',
        hospitalCountry: hospital.country || '',
        hospitalPincode: hospital.pincode || '',
        // Cast the type to the expected union type
        type: (hospital.type || 'general') as "general" | "specialty",
        speciality: hospital.speciality,
        numberOfICUs: hospital.number_of_icus || 0,
        numberOfOPRooms: hospital.number_of_op_rooms || 0,
        numberOfDoctors: hospital.number_of_doctors || 0,
        password: '********' // Masking the password
      }));
      
      setHospitals(transformedHospitals);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch hospitals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const sendWelcomeEmail = async (email: string, name: string, password: string) => {
    try {
      setSendingEmail(true);
      console.log("Sending welcome email to:", email);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          name,
          userType: 'hospital',
          password
        }
      });

      if (error) {
        console.error("Error invoking function:", error);
        throw error;
      }

      console.log("Email function response:", data);
      
      toast({
        title: "Email Sent",
        description: "Welcome email with credentials has been sent",
      });
      
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      toast({
        title: "Error",
        description: "Failed to send welcome email: " + (error as Error).message,
        variant: "destructive",
      });
      return false;
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCreateHospital = () => {
    resetForm();
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setHospitalId(hospital.hospitalId);
    setHospitalName(hospital.hospitalName);
    setEmailId(hospital.emailId);
    setMobile(hospital.mobile);
    setLicenseNumber(hospital.hospitalLicenseNumber);
    setAddress(`${hospital.hospitalHouseNumber} ${hospital.hospitalStreet}, ${hospital.hospitalVillage}, ${hospital.hospitalDistrict}, ${hospital.hospitalState}, ${hospital.hospitalCountry}, ${hospital.hospitalPincode}`);
    setType(hospital.type);
    setSpeciality(hospital.speciality || "");
    setNumberOfICUs(hospital.numberOfICUs);
    setNumberOfOPRooms(hospital.numberOfOPRooms);
    setNumberOfDoctors(hospital.numberOfDoctors);
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleDeleteHospital = async (hospitalId: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;
    
    try {
      // In a real implementation, we would delete from Supabase
      // For now, we'll just update our local state
      const updatedHospitals = hospitals.filter(hospital => hospital.hospitalId !== hospitalId);
      setHospitals(updatedHospitals);
      
      /* 
      const { error } = await supabase
        .from('hospitals')
        .delete()
        .eq('id', hospitalId);
        
      if (error) throw error;
      */
      
      toast({
        title: "Success",
        description: "Hospital deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting hospital:", error);
      toast({
        title: "Error",
        description: "Failed to delete hospital",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!hospitalName || !emailId || !mobile || !licenseNumber || !address || !type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (type === "specialty" && !speciality) {
      toast({
        title: "Error",
        description: "Please enter a speciality for specialty hospitals",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    if (!validateEmail(emailId)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      if (dialogMode === 'create') {
        // Generate a password for the new hospital
        const password = generatePassword();
        console.log("Generated password:", password);
        
        // Parse address (simplified for this example)
        const addressParts = address.split(',').map(part => part.trim());
        const houseNumber = addressParts[0] || '';
        const street = addressParts[1] || '';
        const village = addressParts[2] || '';
        const district = addressParts[3] || '';
        const statePart = addressParts[4] || '';
        const country = addressParts[5] || '';
        const pincode = addressParts[6] || '';
        
        // Create new hospital in Supabase
        const { data, error } = await supabase
          .from('hospitals')
          .insert([{ 
            name: hospitalName,
            email: emailId,
            mobile: mobile,
            license_number: licenseNumber,
            house_number: houseNumber,
            street: street,
            village: village,
            district: district,
            state: statePart,
            country: country,
            pincode: pincode,
            type: type,
            speciality: type === 'specialty' ? speciality : null,
            number_of_icus: numberOfICUs,
            number_of_op_rooms: numberOfOPRooms,
            number_of_doctors: numberOfDoctors,
            password: password // Store the password in the database
          }])
          .select();
          
        if (error) {
          console.error("Error creating hospital:", error);
          throw error;
        }
        
        console.log("Created hospital:", data);
        
        // Send welcome email with credentials
        if (data && data.length > 0) {
          const emailSent = await sendWelcomeEmail(emailId, hospitalName, password);
          if (!emailSent) {
            console.warn("Email not sent, but hospital was created");
          }
        }
        
        // Refresh hospitals list
        fetchHospitals();
        
        toast({
          title: "Success",
          description: "Hospital created successfully",
        });
      } else {
        // Update existing hospital
        if (!selectedHospital) return;
        
        const updatedHospitals = hospitals.map(hospital => 
          hospital.hospitalId === selectedHospital.hospitalId ? {
            ...hospital,
            hospitalName,
            emailId,
            mobile,
            hospitalLicenseNumber: licenseNumber,
            type,
            ...(type === "specialty" && { speciality }),
            numberOfICUs,
            numberOfOPRooms,
            numberOfDoctors,
            // Update address fields would be handled properly in a real app
          } : hospital
        );
        
        setHospitals(updatedHospitals);
        
        /* 
        const { error } = await supabase
          .from('hospitals')
          .update({ 
            name: hospitalName, 
            email: emailId, 
            mobile, 
            license_number: licenseNumber, 
            // ... other fields 
          })
          .eq('id', selectedHospital.hospitalId);
          
        if (error) throw error;
        */
        
        toast({
          title: "Success",
          description: "Hospital updated successfully",
        });
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving hospital:", error);
      toast({
        title: "Error",
        description: "Failed to save hospital: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedHospital(null);
    setHospitalId("");
    setHospitalName("");
    setEmailId("");
    setMobile("");
    setLicenseNumber("");
    setAddress("");
    setType("general");
    setSpeciality("");
    setNumberOfICUs(0);
    setNumberOfOPRooms(0);
    setNumberOfDoctors(0);
  };

  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hospital Management</h1>
          <Button onClick={handleCreateHospital}>Create New Hospital</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Hospitals</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading hospitals...</p>
            ) : hospitals.length === 0 ? (
              <p>No hospitals found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>ICUs</TableHead>
                    <TableHead>OP Rooms</TableHead>
                    <TableHead>Doctors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital) => (
                    <TableRow key={hospital.hospitalId}>
                      <TableCell>{hospital.hospitalId}</TableCell>
                      <TableCell>{hospital.hospitalName}</TableCell>
                      <TableCell>
                        {hospital.type === "specialty" 
                          ? `Specialty (${hospital.speciality})` 
                          : "General"}
                      </TableCell>
                      <TableCell>{hospital.numberOfICUs}</TableCell>
                      <TableCell>{hospital.numberOfOPRooms}</TableCell>
                      <TableCell>{hospital.numberOfDoctors}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditHospital(hospital)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteHospital(hospital.hospitalId)}
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
              {dialogMode === 'create' ? 'Create New Hospital' : 'Edit Hospital'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 grid gap-4">
            {dialogMode === 'edit' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="hospitalId" className="text-right text-sm font-medium">
                  Hospital ID
                </label>
                <Input 
                  id="hospitalId" 
                  value={hospitalId} 
                  className="col-span-3" 
                  disabled 
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="hospitalName" className="text-right text-sm font-medium">
                Name
              </label>
              <Input 
                id="hospitalName" 
                value={hospitalName} 
                onChange={(e) => setHospitalName(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter hospital name" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                type="email" 
                value={emailId} 
                onChange={(e) => setEmailId(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter hospital email" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="mobile" className="text-right text-sm font-medium">
                Mobile
              </label>
              <Input 
                id="mobile" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter contact number" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="licenseNumber" className="text-right text-sm font-medium">
                License No.
              </label>
              <Input 
                id="licenseNumber" 
                value={licenseNumber} 
                onChange={(e) => setLicenseNumber(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter license number" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="address" className="text-right text-sm font-medium">
                Address
              </label>
              <Textarea 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter hospital address" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <Select 
                value={type} 
                onValueChange={(value: "general" | "specialty") => {
                  setType(value);
                  if (value === "general") setSpeciality("");
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select hospital type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {type === "specialty" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="speciality" className="text-right text-sm font-medium">
                  Speciality
                </label>
                <Input 
                  id="speciality" 
                  value={speciality} 
                  onChange={(e) => setSpeciality(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter hospital speciality" 
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="icus" className="text-right text-sm font-medium">
                Number of ICUs
              </label>
              <Input 
                id="icus" 
                type="number" 
                min="0"
                value={numberOfICUs.toString()} 
                onChange={(e) => setNumberOfICUs(parseInt(e.target.value) || 0)} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="opRooms" className="text-right text-sm font-medium">
                OP Rooms
              </label>
              <Input 
                id="opRooms" 
                type="number"
                min="0" 
                value={numberOfOPRooms.toString()} 
                onChange={(e) => setNumberOfOPRooms(parseInt(e.target.value) || 0)} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="doctors" className="text-right text-sm font-medium">
                Number of Doctors
              </label>
              <Input 
                id="doctors" 
                type="number"
                min="0" 
                value={numberOfDoctors.toString()} 
                onChange={(e) => setNumberOfDoctors(parseInt(e.target.value) || 0)} 
                className="col-span-3" 
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

export default Hospitals;
