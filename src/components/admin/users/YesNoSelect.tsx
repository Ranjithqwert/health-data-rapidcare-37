
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface YesNoSelectProps {
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
  label: string;
  additionalField?: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  };
}

const YesNoSelect: React.FC<YesNoSelectProps> = ({
  value,
  onChange,
  label,
  additionalField
}) => {
  return (
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
};

export default YesNoSelect;
