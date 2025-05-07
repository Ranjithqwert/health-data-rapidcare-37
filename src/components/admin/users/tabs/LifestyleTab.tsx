
import React from "react";
import YesNoSelect from "../YesNoSelect";

interface LifestyleTabProps {
  smoke: "Yes" | "No";
  setSmoke: (smoke: "Yes" | "No") => void;
  alcohol: "Yes" | "No";
  setAlcohol: (alcohol: "Yes" | "No") => void;
  inTreatment: "Yes" | "No";
  setInTreatment: (inTreatment: "Yes" | "No") => void;
}

const LifestyleTab: React.FC<LifestyleTabProps> = ({
  smoke,
  setSmoke,
  alcohol,
  setAlcohol,
  inTreatment,
  setInTreatment
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lifestyle Habits</h3>
        
        <div className="space-y-4">
          <YesNoSelect 
            value={smoke} 
            onChange={setSmoke} 
            label="Smoking" 
          />
          <YesNoSelect 
            value={alcohol} 
            onChange={setAlcohol} 
            label="Alcohol Consumption" 
          />
          <YesNoSelect 
            value={inTreatment} 
            onChange={setInTreatment} 
            label="Currently In Treatment" 
          />
        </div>
      </div>
    </div>
  );
};

export default LifestyleTab;
