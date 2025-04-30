import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form fields
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

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
    setAddress(`${user.houseNumber} ${user.street}, ${user.village}, ${user.district}, ${user.state}, ${user.country}, ${user.pincode}`);
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
    if (!name || !email || !mobile || !dob || !address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
          age: calculateAge(dob),
          sugar: "No",
          bp: "No",
          cardiac: "No",
          kidney: "No",
          liver: "No",
          lungs: "No",
          smoke: "No",
          alcohol: "No",
          inTreatment: "No",
          height: 170, // Default values
          weight: 70,
          bmi: 24.2,
          obesityLevel: "Correct",
          houseNumber: "123", // Simplified for demo
          street: "Street",
          village: "Village",
          district: "District",
          state: "State",
          country: "Country",
          pincode: "12345",
          password: "password", 
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
            // Update address fields would be handled properly in a real app
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
    setAddress("");
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

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
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create New User' : 'Edit User'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 grid gap-4">
            {dialogMode === 'edit' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="userId" className="text-right text-sm font-medium">
                  User ID
                </label>
                <Input 
                  id="userId" 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)} 
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
                placeholder="Enter user's name" 
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
                placeholder="Enter user's email" 
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
                placeholder="Enter user's mobile number" 
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
              <label htmlFor="address" className="text-right text-sm font-medium">
                Address
              </label>
              <Textarea 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter user's address" 
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

export default Users;
