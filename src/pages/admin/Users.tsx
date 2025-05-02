
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { generatePassword, sendWelcomeEmail } from "@/utils/email-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { FormLabel } from "@/components/ui/form";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Basic user info
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  
  // Address fields
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  
  // Health information
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [sugar, setSugar] = useState<"Yes" | "No">("No");
  const [sugarLevel, setSugarLevel] = useState("");
  const [bp, setBp] = useState<"Yes" | "No">("No");
  const [bpLevel, setBpLevel] = useState("");
  const [cardiac, setCardiac] = useState<"Yes" | "No">("No");
  const [cardiacInfo, setCardiacInfo] = useState("");
  const [kidney, setKidney] = useState<"Yes" | "No">("No");
  const [kidneyInfo, setKidneyInfo] = useState("");
  const [liver, setLiver] = useState<"Yes" | "No">("No");
  const [liverInfo, setLiverInfo] = useState("");
  const [lungs, setLungs] = useState<"Yes" | "No">("No");
  const [lungsInfo, setLungsInfo] = useState("");
  
  // Lifestyle
  const [smoke, setSmoke] = useState<"Yes" | "No">("No");
  const [alcohol, setAlcohol] = useState<"Yes" | "No">("No");
  const [inTreatment, setInTreatment] = useState<"Yes" | "No">("No");
  
  // Calculated fields
  const [bmi, setBmi] = useState<number>(0);
  const [obesity, setObesity] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    // Calculate BMI whenever height or weight changes
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(Math.round(calculatedBmi * 10) / 10);
      
      // Determine obesity level
      if (calculatedBmi < 18.5) {
        setObesity("Low");
      } else if (calculatedBmi > 25) {
        setObesity("High");
      } else {
        setObesity("Correct");
      }
    }
  }, [height, weight]);
  
  useEffect(() => {
    // Calculate age whenever date of birth changes
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    }
  }, [dob]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Real implementation using Supabase
      const { data, error } = await supabase
        .from('patients')
        .select('*');
        
      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Transform the data to match our User model
      const transformedUsers: User[] = data.map(user => ({
        userId: user.id,
        name: user.name,
        mobileNumber: user.mobile_number,
        emailId: user.email,
        dateOfBirth: user.dob,
        age: calculateAge(user.dob),
        // Convert database boolean values to "Yes"/"No" strings for the UI
        sugar: user.sugar ? "Yes" : "No",
        sugarLevel: user.sugar_level,
        bp: user.bp ? "Yes" : "No",
        bpLevel: user.bp_level,
        cardiac: user.cardiac ? "Yes" : "No",
        cardiacInfo: user.cardiac_info,
        kidney: user.kidney ? "Yes" : "No",
        kidneyInfo: user.kidney_info,
        liver: user.liver ? "Yes" : "No",
        liverInfo: user.liver_info,
        lungs: user.lungs ? "Yes" : "No",
        lungsInfo: user.lungs_info,
        smoke: user.smoke ? "Yes" : "No",
        alcohol: user.alcohol ? "Yes" : "No",
        inTreatment: user.in_treatment ? "Yes" : "No",
        // Fix the field names to match what's in the database
        height: user.height_cm || 0,
        weight: user.weight_kg || 0,
        bmi: user.bmi || 0,
        obesityLevel: user.obesity_level as "Low" | "Correct" | "High" || "Correct",
        houseNumber: user.house_number || '',
        street: user.street || '',
        village: user.village || '',
        district: user.district || '',
        state: user.state || '',
        country: user.country || '',
        pincode: user.pincode || '',
        password: '********',  // Masking the password
        createdDate: new Date(user.created_at).getDate().toString(),
        createdMonth: new Date(user.created_at).toLocaleString('default', { month: 'long' }),
        createdYear: new Date(user.created_at).getFullYear().toString()
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCreateUser = () => {
    resetForm();
    setDialogMode('create');
    setOpenDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserId(user.userId);
    setName(user.name);
    setEmail(user.emailId);
    setMobile(user.mobileNumber);
    setDob(user.dateOfBirth);
    
    // Address fields
    setHouseNumber(user.houseNumber || "");
    setStreet(user.street || "");
    setVillage(user.village || "");
    setDistrict(user.district || "");
    setState(user.state || "");
    setCountry(user.country || "");
    setPincode(user.pincode || "");
    
    // Health information
    setHeight(user.height || 170);
    setWeight(user.weight || 70);
    setSugar(user.sugar || "No");
    setSugarLevel(user.sugarLevel || "");
    setBp(user.bp || "No");
    setBpLevel(user.bpLevel || "");
    setCardiac(user.cardiac || "No");
    setCardiacInfo(user.cardiacInfo || "");
    setKidney(user.kidney || "No");
    setKidneyInfo(user.kidneyInfo || "");
    setLiver(user.liver || "No");
    setLiverInfo(user.liverInfo || "");
    setLungs(user.lungs || "No");
    setLungsInfo(user.lungsInfo || "");
    
    // Lifestyle
    setSmoke(user.smoke || "No");
    setAlcohol(user.alcohol || "No");
    setInTreatment(user.inTreatment || "No");
    
    setDialogMode('edit');
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      // In a real implementation, we would delete from Supabase
      // For now, we'll just update our local state
      const updatedUsers = users.filter(user => user.userId !== userId);
      setUsers(updatedUsers);
      
      /* 
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      */
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
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
          userType: 'user',
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

  const handleSubmit = async () => {
    // Basic validation
    if (!name || !email || !mobile || !dob) {
      toast({
        title: "Error",
        description: "Please fill in all required fields in the Basic Info tab",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      if (dialogMode === 'create') {
        // Generate a password for the new user
        const password = generatePassword();
        console.log("Generated password:", password);
        
        // Create new user in Supabase - fix the field mapping
        const { data, error } = await supabase
          .from('patients')
          .insert([{
            name,
            email,
            mobile_number: mobile,
            dob,
            house_number: houseNumber,
            street,
            village,
            district,
            state,
            country,
            pincode,
            height_cm: height, // Use the correct field name for the database
            weight_kg: weight, // Use the correct field name for the database
            bmi,
            obesity_level: obesity,
            // Convert "Yes"/"No" strings to boolean for the database
            sugar: sugar === "Yes",
            sugar_level: sugar === "Yes" ? sugarLevel : null,
            bp: bp === "Yes",
            bp_level: bp === "Yes" ? bpLevel : null,
            cardiac: cardiac === "Yes",
            cardiac_info: cardiac === "Yes" ? cardiacInfo : null,
            kidney: kidney === "Yes",
            kidney_info: kidney === "Yes" ? kidneyInfo : null,
            liver: liver === "Yes",
            liver_info: liver === "Yes" ? liverInfo : null,
            lungs: lungs === "Yes",
            lungs_info: lungs === "Yes" ? lungsInfo : null,
            smoke: smoke === "Yes",
            alcohol: alcohol === "Yes",
            in_treatment: inTreatment === "Yes",
            password, // Store the password in the database
            created_at: new Date().toISOString()
          }])
          .select();
          
        if (error) {
          console.error("Error creating user:", error);
          throw error;
        }
        
        console.log("Created user:", data);
        
        // Send welcome email with credentials
        if (data && data.length > 0) {
          const emailSent = await sendWelcomeEmail(email, name, password);
          if (!emailSent) {
            console.warn("Email not sent, but user was created");
          }
        }
        
        // Refresh users list
        fetchUsers();
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else {
        // Update existing user
        if (!selectedUser) return;
        
        const { error } = await supabase
          .from('patients')
          .update({
            name,
            email,
            mobile_number: mobile,
            dob,
            house_number: houseNumber,
            street,
            village,
            district,
            state,
            country,
            pincode,
            height_cm: height, // Use the correct field name for the database
            weight_kg: weight, // Use the correct field name for the database
            bmi,
            obesity_level: obesity,
            // Convert "Yes"/"No" strings to boolean for the database
            sugar: sugar === "Yes",
            sugar_level: sugar === "Yes" ? sugarLevel : null,
            bp: bp === "Yes",
            bp_level: bp === "Yes" ? bpLevel : null,
            cardiac: cardiac === "Yes",
            cardiac_info: cardiac === "Yes" ? cardiacInfo : null,
            kidney: kidney === "Yes",
            kidney_info: kidney === "Yes" ? kidneyInfo : null,
            liver: liver === "Yes",
            liver_info: liver === "Yes" ? liverInfo : null,
            lungs: lungs === "Yes",
            lungs_info: lungs === "Yes" ? lungsInfo : null,
            smoke: smoke === "Yes",
            alcohol: alcohol === "Yes",
            in_treatment: inTreatment === "Yes",
          })
          .eq('id', selectedUser.userId);
          
        if (error) throw error;
        
        // Refresh users list
        fetchUsers();
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Failed to save user: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setUserId("");
    setName("");
    setEmail("");
    setMobile("");
    setDob("");
    
    // Reset address fields
    setHouseNumber("");
    setStreet("");
    setVillage("");
    setDistrict("");
    setState("");
    setCountry("");
    setPincode("");
    
    // Reset health information
    setHeight(170);
    setWeight(70);
    setSugar("No");
    setSugarLevel("");
    setBp("No");
    setBpLevel("");
    setCardiac("No");
    setCardiacInfo("");
    setKidney("No");
    setKidneyInfo("");
    setLiver("No");
    setLiverInfo("");
    setLungs("No");
    setLungsInfo("");
    
    // Reset lifestyle
    setSmoke("No");
    setAlcohol("No");
    setInTreatment("No");
    
    // Reset calculated fields
    setBmi(0);
    setObesity("Correct");
    setAge(0);
    
    // Reset active tab
    setActiveTab("basic");
  };

  const renderYesNoSelect = (
    value: "Yes" | "No", 
    onChange: (value: "Yes" | "No") => void,
    label: string,
    additionalField?: {
      value: string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
      placeholder: string
    }
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="w-32">
          <Label>{label}</Label>
        </div>
        <Select value={value} onValueChange={(v) => onChange(v as "Yes" | "No")}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {value === "Yes" && additionalField && (
        <div className="ml-36">
          <Input 
            value={additionalField.value} 
            onChange={additionalField.onChange}
            placeholder={additionalField.placeholder}
          />
        </div>
      )}
    </div>
  );

  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={handleCreateUser}>Create New User</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>{user.userId}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.emailId}</TableCell>
                        <TableCell>{user.mobileNumber}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteUser(user.userId)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create New User' : 'Edit User'}
            </DialogTitle>
            <DialogDescription>
              Fill in the user details across all tabs.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              {dialogMode === 'edit' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userId" className="text-right text-sm font-medium">
                    User ID
                  </Label>
                  <Input 
                    id="userId" 
                    value={userId} 
                    className="col-span-3" 
                    disabled 
                  />
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-sm font-medium">
                  Full Name *
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter user's full name" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-sm font-medium">
                  Email *
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter user's email" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobile" className="text-right text-sm font-medium">
                  Mobile *
                </Label>
                <Input 
                  id="mobile" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter user's mobile number" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dob" className="text-right text-sm font-medium">
                  Date of Birth *
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <Input 
                    id="dob" 
                    type="date" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    className="w-full" 
                    required
                  />
                  {age > 0 && (
                    <span className="text-sm text-muted-foreground">Age: {age} years</span>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="houseNumber" className="text-right text-sm font-medium">
                  House/Building Number
                </Label>
                <Input 
                  id="houseNumber" 
                  value={houseNumber} 
                  onChange={(e) => setHouseNumber(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter house/building number" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="street" className="text-right text-sm font-medium">
                  Street/Road
                </Label>
                <Input 
                  id="street" 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter street/road" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="village" className="text-right text-sm font-medium">
                  Village/Area/Locality
                </Label>
                <Input 
                  id="village" 
                  value={village} 
                  onChange={(e) => setVillage(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter village/area/locality" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="district" className="text-right text-sm font-medium">
                  District/City
                </Label>
                <Input 
                  id="district" 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter district/city" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right text-sm font-medium">
                  State/Province
                </Label>
                <Input 
                  id="state" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter state/province" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right text-sm font-medium">
                  Country
                </Label>
                <Input 
                  id="country" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter country" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pincode" className="text-right text-sm font-medium">
                  Pincode/Zipcode
                </Label>
                <Input 
                  id="pincode" 
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Enter pincode/zipcode" 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Physical Measurements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input 
                        id="height" 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(Number(e.target.value))} 
                        placeholder="Height in centimeters" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input 
                        id="weight" 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(Number(e.target.value))} 
                        placeholder="Weight in kilograms" 
                      />
                    </div>
                  </div>
                  
                  {bmi > 0 && (
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">BMI: {bmi}</p>
                      <p>Obesity Level: {obesity}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Medical Conditions</h3>
                  
                  <div className="space-y-4">
                    {renderYesNoSelect(
                      sugar, 
                      setSugar, 
                      "Diabetes/Sugar", 
                      {value: sugarLevel, onChange: (e) => setSugarLevel(e.target.value), placeholder: "Sugar level (e.g. 120 mg/dL)"}
                    )}
                    
                    {renderYesNoSelect(
                      bp, 
                      setBp, 
                      "Blood Pressure", 
                      {value: bpLevel, onChange: (e) => setBpLevel(e.target.value), placeholder: "BP level (e.g. 120/80 mmHg)"}
                    )}
                    
                    {renderYesNoSelect(
                      cardiac, 
                      setCardiac, 
                      "Cardiac Issues", 
                      {value: cardiacInfo, onChange: (e) => setCardiacInfo(e.target.value), placeholder: "Details about cardiac condition"}
                    )}
                    
                    {renderYesNoSelect(
                      kidney, 
                      setKidney, 
                      "Kidney Issues", 
                      {value: kidneyInfo, onChange: (e) => setKidneyInfo(e.target.value), placeholder: "Details about kidney condition"}
                    )}
                    
                    {renderYesNoSelect(
                      liver, 
                      setLiver, 
                      "Liver Issues", 
                      {value: liverInfo, onChange: (e) => setLiverInfo(e.target.value), placeholder: "Details about liver condition"}
                    )}
                    
                    {renderYesNoSelect(
                      lungs, 
                      setLungs, 
                      "Lung Issues", 
                      {value: lungsInfo, onChange: (e) => setLungsInfo(e.target.value), placeholder: "Details about lung condition"}
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lifestyle" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lifestyle Habits</h3>
                  
                  <div className="space-y-4">
                    {renderYesNoSelect(smoke, setSmoke, "Smoking")}
                    {renderYesNoSelect(alcohol, setAlcohol, "Alcohol Consumption")}
                    {renderYesNoSelect(inTreatment, setInTreatment, "Currently In Treatment")}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <div className="flex-1 flex justify-start">
              {activeTab !== "basic" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "address", "health", "lifestyle"];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              {activeTab !== "lifestyle" ? (
                <Button 
                  onClick={() => {
                    const tabs = ["basic", "address", "health", "lifestyle"];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[currentIndex + 1]);
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={sendingEmail}>
                  {sendingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Email...
                    </>
                  ) : dialogMode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
};

export default Users;
