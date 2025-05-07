
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generatePassword } from "@/utils/email-utils";
import { User } from "@/models/models";
import UserTable from "./UserTable";
import UserFormDialog from "./UserFormDialog";

const UserManagement: React.FC = () => {
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
        height_cm: user.height_cm || 0,
        weight_kg: user.weight_kg || 0,
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
    setHeight(user.height_cm || 170);
    setWeight(user.weight_kg || 70);
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
      // Delete the user from Supabase
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', userId);
        
      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user: " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Update local state only after successful deletion
      const updatedUsers = users.filter(user => user.userId !== userId);
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user: " + (error as Error).message,
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={handleCreateUser}>Create New User</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable 
            users={users} 
            loading={loading} 
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser} 
          />
        </CardContent>
      </Card>

      <UserFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        dialogMode={dialogMode}
        onSubmit={handleSubmit}
        // Form state
        userId={userId}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        mobile={mobile}
        setMobile={setMobile}
        dob={dob}
        setDob={setDob}
        // Address fields
        houseNumber={houseNumber}
        setHouseNumber={setHouseNumber}
        street={street}
        setStreet={setStreet}
        village={village}
        setVillage={setVillage}
        district={district}
        setDistrict={setDistrict}
        state={state}
        setState={setState}
        country={country}
        setCountry={setCountry}
        pincode={pincode}
        setPincode={setPincode}
        // Health information
        height={height}
        setHeight={setHeight}
        weight={weight}
        setWeight={setWeight}
        sugar={sugar}
        setSugar={setSugar}
        sugarLevel={sugarLevel}
        setSugarLevel={setSugarLevel}
        bp={bp}
        setBp={setBp}
        bpLevel={bpLevel}
        setBpLevel={setBpLevel}
        cardiac={cardiac}
        setCardiac={setCardiac}
        cardiacInfo={cardiacInfo}
        setCardiacInfo={setCardiacInfo}
        kidney={kidney}
        setKidney={setKidney}
        kidneyInfo={kidneyInfo}
        setKidneyInfo={setKidneyInfo}
        liver={liver}
        setLiver={setLiver}
        liverInfo={liverInfo}
        setLiverInfo={setLiverInfo}
        lungs={lungs}
        setLungs={setLungs}
        lungsInfo={lungsInfo}
        setLungsInfo={setLungsInfo}
        // Lifestyle
        smoke={smoke}
        setSmoke={setSmoke}
        alcohol={alcohol}
        setAlcohol={setAlcohol}
        inTreatment={inTreatment}
        setInTreatment={setInTreatment}
        // Calculated fields
        bmi={bmi}
        obesity={obesity}
        age={age}
        // Tab navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sendingEmail={sendingEmail}
      />
    </>
  );
};

export default UserManagement;
