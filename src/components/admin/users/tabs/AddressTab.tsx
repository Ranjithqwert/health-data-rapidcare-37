
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressTabProps {
  houseNumber: string;
  setHouseNumber: (houseNumber: string) => void;
  street: string;
  setStreet: (street: string) => void;
  village: string;
  setVillage: (village: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  state: string;
  setState: (state: string) => void;
  country: string;
  setCountry: (country: string) => void;
  pincode: string;
  setPincode: (pincode: string) => void;
}

const AddressTab: React.FC<AddressTabProps> = ({
  houseNumber,
  setHouseNumber,
  street,
  setStreet,
  village,
  setVillage,
  district,
  setDistrict,
  state,
  setState,
  country,
  setCountry,
  pincode,
  setPincode
}) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AddressTab;
