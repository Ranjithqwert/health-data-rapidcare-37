
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoTab from "./tabs/BasicInfoTab";
import AddressTab from "./tabs/AddressTab";
import HealthTab from "./tabs/HealthTab";
import LifestyleTab from "./tabs/LifestyleTab";

interface UserFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  // Address props
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
  // Health props
  height: number;
  setHeight: (height: number) => void;
  weight: number;
  setWeight: (weight: number) => void;
  sugar: "Yes" | "No";
  setSugar: (sugar: "Yes" | "No") => void;
  sugarLevel: string;
  setSugarLevel: (sugarLevel: string) => void;
  bp: "Yes" | "No";
  setBp: (bp: "Yes" | "No") => void;
  bpLevel: string;
  setBpLevel: (bpLevel: string) => void;
  cardiac: "Yes" | "No";
  setCardiac: (cardiac: "Yes" | "No") => void;
  cardiacInfo: string;
  setCardiacInfo: (cardiacInfo: string) => void;
  kidney: "Yes" | "No";
  setKidney: (kidney: "Yes" | "No") => void;
  kidneyInfo: string;
  setKidneyInfo: (kidneyInfo: string) => void;
  liver: "Yes" | "No";
  setLiver: (liver: "Yes" | "No") => void;
  liverInfo: string;
  setLiverInfo: (liverInfo: string) => void;
  lungs: "Yes" | "No";
  setLungs: (lungs: "Yes" | "No") => void;
  lungsInfo: string;
  setLungsInfo: (lungsInfo: string) => void;
  // Lifestyle props
  smoke: "Yes" | "No";
  setSmoke: (smoke: "Yes" | "No") => void;
  alcohol: "Yes" | "No";
  setAlcohol: (alcohol: "Yes" | "No") => void;
  inTreatment: "Yes" | "No";
  setInTreatment: (inTreatment: "Yes" | "No") => void;
  // Calculated values
  bmi: number;
  obesity: string;
}

const UserFormTabs: React.FC<UserFormTabsProps> = ({
  activeTab,
  setActiveTab,
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
  dialogMode,
  // Address props
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
  setPincode,
  // Health props
  height,
  setHeight,
  weight,
  setWeight,
  sugar,
  setSugar,
  sugarLevel,
  setSugarLevel,
  bp,
  setBp,
  bpLevel,
  setBpLevel,
  cardiac,
  setCardiac,
  cardiacInfo,
  setCardiacInfo,
  kidney,
  setKidney,
  kidneyInfo,
  setKidneyInfo,
  liver,
  setLiver,
  liverInfo,
  setLiverInfo,
  lungs,
  setLungs,
  lungsInfo,
  setLungsInfo,
  // Lifestyle props
  smoke,
  setSmoke,
  alcohol,
  setAlcohol,
  inTreatment,
  setInTreatment,
  // Calculated values
  bmi,
  obesity
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="address">Address</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicInfoTab
          userId={userId}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          mobile={mobile}
          setMobile={setMobile}
          dob={dob}
          setDob={setDob}
          age={age}
          dialogMode={dialogMode}
        />
      </TabsContent>
      
      <TabsContent value="address">
        <AddressTab
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
        />
      </TabsContent>
      
      <TabsContent value="health">
        <HealthTab
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
          bmi={bmi}
          obesity={obesity}
        />
      </TabsContent>
      
      <TabsContent value="lifestyle">
        <LifestyleTab
          smoke={smoke}
          setSmoke={setSmoke}
          alcohol={alcohol}
          setAlcohol={setAlcohol}
          inTreatment={inTreatment}
          setInTreatment={setInTreatment}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserFormTabs;
