import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

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
      
      // For demonstration purposes, we'll create mock data
      const mockUsers: User[] = [
        {
          userId: "user1",
          name: "John Doe",
          mobileNumber: "1234567890",
          emailId: "john@example.com",
          dateOfBirth: "1990-05-15",
          age: 33,
          sugar: "No",
          bp: "No",
          cardiac: "No",
          kidney: "No",
          liver: "No",
          lungs: "No",
          smoke: "Yes",
          alcohol: "No",
          inTreatment: "No",
          height: 175,
          weight: 75,
          bmi: 24.5,
          obesityLevel: "Correct",
          houseNumber: "123",
          street: "Main Street",
          village: "Downtown",
          district: "Central",
          state: "California",
          country: "USA",
          pincode: "90001",
          password: "********", 
          createdDate: "15",
          createdMonth: "May",
          createdYear: "2023"
        },
        {
          userId: "user2",
          name: "Jane Smith",
          mobileNumber: "9876543210",
          emailId: "jane@example.com",
          dateOfBirth: "1985-08-22",
          age: 38,
          sugar: "Yes",
          sugarLevel: "140 mg/dL",
          bp: "Yes",
          bpLevel: "140/90 mmHg",
          cardiac: "No",
          kidney: "No",
          liver: "No",
          lungs: "No",
          smoke: "No",
          alcohol: "Yes",
          inTreatment: "Yes",
          height: 165,
          weight: 68,
          bmi: 25,
          obesityLevel: "High",
          houseNumber: "456",
          street: "Oak Avenue",
          village: "Suburbia",
          district: "West",
          state: "New York",
          country: "USA",
          pincode: "10001",
          password: "********", 
          createdDate: "10",
          createdMonth: "June",
          createdYear: "2023"
        }
      ];
      
      setUsers(mockUsers);
      
      // In a real implementation, we would fetch from Supabase
      /*
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
      
      setUsers(data || []);
      */
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

    try {
      if (dialogMode === 'create') {
        // Create new user
        const newUser: User = {
          userId: `user${Date.now()}`, // Generate a temporary ID
          name,
          mobileNumber: mobile,
          emailId: email,
          dateOfBirth: dob,
          age: age,
          sugar: sugar,
          sugarLevel: sugar === "Yes" ? sugarLevel : undefined,
          bp: bp,
          bpLevel: bp === "Yes" ? bpLevel : undefined,
          cardiac: cardiac,
          cardiacInfo: cardiac === "Yes" ? cardiacInfo : undefined,
          kidney: kidney,
          kidneyInfo: kidney === "Yes" ? kidneyInfo : undefined,
          liver: liver,
          liverInfo: liver === "Yes" ? liverInfo : undefined,
          lungs: lungs,
          lungsInfo: lungs === "Yes" ? lungsInfo : undefined,
          smoke: smoke,
          alcohol: alcohol,
          inTreatment: inTreatment,
          height: height,
          weight: weight, 
          bmi: bmi, 
          obesityLevel: obesity as "Low" | "Correct" | "High",
          houseNumber: houseNumber,
          street: street,
          village: village,
          district: district,
          state: state,
          country: country,
          pincode: pincode,
          password: "password", // Default password
          createdDate: new Date().getDate().toString(),
          createdMonth: new Date().toLocaleString('default', { month: 'long' }),
          createdYear: new Date().getFullYear().toString()
        };
        
        setUsers([...users, newUser]);
        
        /* 
        const { error } = await supabase
          .from('patients')
          .insert([{ 
            name, 
            email, 
            mobile_number: mobile, 
            dob,
            // ... other fields 
          }]);
          
        if (error) throw error;
        */
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      } else {
        // Update existing user
        if (!selectedUser) return;
        
        const updatedUsers = users.map(user => 
          user.userId === selectedUser.userId ? {
            ...user,
            name,
            emailId: email,
            mobileNumber: mobile,
            dateOfBirth: dob,
            age: age,
            sugar: sugar,
            sugarLevel: sugar === "Yes" ? sugarLevel : undefined,
            bp: bp,
            bpLevel: bp === "Yes" ? bpLevel : undefined,
            cardiac: cardiac,
            cardiacInfo: cardiac === "Yes" ? cardiacInfo : undefined,
            kidney: kidney,
            kidneyInfo: kidney === "Yes" ? kidneyInfo : undefined,
            liver: liver,
            liverInfo: liver === "Yes" ? liverInfo : undefined,
            lungs: lungs,
            lungsInfo: lungs === "Yes" ? lungsInfo : undefined,
            smoke: smoke,
            alcohol: alcohol,
            inTreatment: inTreatment,
            height: height,
            weight: weight, 
            bmi: bmi, 
            obesityLevel: obesity as "Low" | "Correct" | "High",
            houseNumber: houseNumber,
            street: street,
            village: village,
            district: district,
            state: state,
            country: country,
            pincode: pincode,
          } : user
        );
        
        setUsers(updatedUsers);
        
        /* 
        const { error } = await supabase
          .from('patients')
          .update({ 
            name, 
            email, 
            mobile_number: mobile, 
            dob,
            // ... other fields 
          })
          .eq('id', selectedUser.userId);
          
        if (error) throw error;
        */
        
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
        description: "Failed to save user",
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
              <p>Loading users...</p>
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
                <Button onClick={handleSubmit}>
                  {dialogMode === 'create' ? 'Create' : 'Save Changes'}
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
