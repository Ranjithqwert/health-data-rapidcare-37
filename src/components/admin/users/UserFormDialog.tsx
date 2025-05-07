
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import UserFormTabs from "./UserFormTabs";
import UserFormActions from "./UserFormActions";
import { User } from "@/models/models";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogMode: "create" | "edit";
  onSubmit: () => void;
  // Form state
  userId: string;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  dob: string;
  setDob: (dob: string) => void;
  // Address fields
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
  // Health information
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
  // Lifestyle
  smoke: "Yes" | "No";
  setSmoke: (smoke: "Yes" | "No") => void;
  alcohol: "Yes" | "No";
  setAlcohol: (alcohol: "Yes" | "No") => void;
  inTreatment: "Yes" | "No";
  setInTreatment: (inTreatment: "Yes" | "No") => void;
  // Calculated fields
  bmi: number;
  obesity: string;
  age: number;
  // Tab navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sendingEmail: boolean;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  dialogMode,
  onSubmit,
  // Form state
  userId,
  name,
  setName,
  email,
  setEmail,
  mobile,
  setMobile,
  dob,
  setDob,
  // Address fields
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
  // Health information
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
  // Lifestyle
  smoke,
  setSmoke,
  alcohol,
  setAlcohol,
  inTreatment,
  setInTreatment,
  // Calculated fields
  bmi,
  obesity,
  age,
  // Tab navigation
  activeTab,
  setActiveTab,
  sendingEmail
}) => {
  const handlePreviousClick = () => {
    const tabs = ["basic", "address", "health", "lifestyle"];
    const currentIndex = tabs.indexOf(activeTab);
    setActiveTab(tabs[currentIndex - 1]);
  };

  const handleNextClick = () => {
    const tabs = ["basic", "address", "health", "lifestyle"];
    const currentIndex = tabs.indexOf(activeTab);
    setActiveTab(tabs[currentIndex + 1]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {dialogMode === 'create' ? 'Create New User' : 'Edit User'}
          </DialogTitle>
          <DialogDescription>
            Fill in the user details across all tabs.
          </DialogDescription>
        </DialogHeader>
        
        <UserFormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
          // Address props
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
          // Health props
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
          // Lifestyle props  
          smoke={smoke}
          setSmoke={setSmoke}
          alcohol={alcohol}
          setAlcohol={setAlcohol}
          inTreatment={inTreatment}
          setInTreatment={setInTreatment}
          // Calculated values
          bmi={bmi}
          obesity={obesity}
        />
        
        <UserFormActions
          activeTab={activeTab}
          onPreviousClick={handlePreviousClick}
          onNextClick={handleNextClick}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
          dialogMode={dialogMode}
          sendingEmail={sendingEmail}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
