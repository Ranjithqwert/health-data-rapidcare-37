
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import YesNoSelect from "../YesNoSelect";

interface HealthTabProps {
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
  bmi: number;
  obesity: string;
}

const HealthTab: React.FC<HealthTabProps> = ({
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
  bmi,
  obesity
}) => {
  return (
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
          <YesNoSelect
            value={sugar}
            onChange={setSugar}
            label="Diabetes/Sugar"
            additionalField={{
              value: sugarLevel,
              onChange: (e) => setSugarLevel(e.target.value),
              placeholder: "Sugar level (e.g. 120 mg/dL)"
            }}
          />
          
          <YesNoSelect
            value={bp}
            onChange={setBp}
            label="Blood Pressure"
            additionalField={{
              value: bpLevel,
              onChange: (e) => setBpLevel(e.target.value),
              placeholder: "BP level (e.g. 120/80 mmHg)"
            }}
          />
          
          <YesNoSelect
            value={cardiac}
            onChange={setCardiac}
            label="Cardiac Issues"
            additionalField={{
              value: cardiacInfo,
              onChange: (e) => setCardiacInfo(e.target.value),
              placeholder: "Details about cardiac condition"
            }}
          />
          
          <YesNoSelect
            value={kidney}
            onChange={setKidney}
            label="Kidney Issues"
            additionalField={{
              value: kidneyInfo,
              onChange: (e) => setKidneyInfo(e.target.value),
              placeholder: "Details about kidney condition"
            }}
          />
          
          <YesNoSelect
            value={liver}
            onChange={setLiver}
            label="Liver Issues"
            additionalField={{
              value: liverInfo,
              onChange: (e) => setLiverInfo(e.target.value),
              placeholder: "Details about liver condition"
            }}
          />
          
          <YesNoSelect
            value={lungs}
            onChange={setLungs}
            label="Lung Issues"
            additionalField={{
              value: lungsInfo,
              onChange: (e) => setLungsInfo(e.target.value),
              placeholder: "Details about lung condition"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthTab;
