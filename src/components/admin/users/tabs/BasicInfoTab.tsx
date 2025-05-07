
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoTabProps {
  userId: string;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  dob: string;
  setDob: (dob: string) => void;
  age: number;
  dialogMode: 'create' | 'edit';
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  userId,
  name,
  setName,
  email,
  setEmail,
  mobile,
  setMobile,
  dob,
  setDob,
  age,
  dialogMode
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default BasicInfoTab;
