
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const NewAdmissionForm = ({ onAdmissionCreated }: { onAdmissionCreated: () => void }) => {
  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const lookupPatient = async () => {
    if (!patientId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive"
      });
      return;
    }

    setLookupLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        toast({
          title: "Patient not found",
          description: "No patient with the provided ID was found",
          variant: "destructive"
        });
        setPatientDetails(null);
      } else {
        setPatientDetails(data);
      }
    } catch (error) {
      console.error("Error looking up patient:", error);
      toast({
        title: "Error",
        description: "Failed to look up patient",
        variant: "destructive"
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const createAdmission = async () => {
    if (!patientDetails) {
      toast({
        title: "Error",
        description: "Patient details are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const hospitalId = localStorage.getItem('userId');
      if (!hospitalId) {
        throw new Error("Hospital ID not found");
      }

      // Get hospital name for the record
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospitals')
        .select('name')
        .eq('id', hospitalId)
        .single();
        
      if (hospitalError) throw hospitalError;
      if (!hospitalData) throw new Error("Hospital not found");
      
      const hospitalName = hospitalData.name;
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const currentTime = format(new Date(), "HH:mm:ss");

      const { data, error } = await supabase
        .from('admissions')
        .insert({
          patient_id: patientId,
          patient_name: patientDetails.name,
          hospital_id: hospitalId,
          hospital_name: hospitalName,
          date_in: currentDate,
          time_in: currentTime,
          discharged: false
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Patient admitted successfully",
      });
      
      // Reset form
      setPatientId("");
      setPatientDetails(null);
      
      // Notify parent component
      onAdmissionCreated();
    } catch (error) {
      console.error("Error creating admission:", error);
      toast({
        title: "Error",
        description: "Failed to create admission",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Patient Admission</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>
            <Button 
              onClick={lookupPatient} 
              disabled={lookupLoading}
              variant="outline"
            >
              {lookupLoading ? "Looking up..." : "Look up"}
            </Button>
          </div>

          {patientDetails && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Patient Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="text-gray-700">{patientDetails.name}</p>
                    </div>
                    <div>
                      <Label>Age</Label>
                      <p className="text-gray-700">{patientDetails.age}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-gray-700">{patientDetails.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-gray-700">{patientDetails.mobile_number}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Health Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Height</Label>
                      <p className="text-gray-700">{patientDetails.height_cm} cm</p>
                    </div>
                    <div>
                      <Label>Weight</Label>
                      <p className="text-gray-700">{patientDetails.weight_kg} kg</p>
                    </div>
                    <div>
                      <Label>BMI</Label>
                      <p className="text-gray-700">{patientDetails.bmi?.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label>Obesity Level</Label>
                      <p className="text-gray-700">{patientDetails.obesity_level || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Medical Conditions</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Sugar</Label>
                      <p className="text-gray-700">{patientDetails.sugar ? 'Yes' : 'No'}</p>
                      {patientDetails.sugar && patientDetails.sugar_level && (
                        <p className="text-sm text-gray-500">Level: {patientDetails.sugar_level}</p>
                      )}
                    </div>
                    <div>
                      <Label>Blood Pressure</Label>
                      <p className="text-gray-700">{patientDetails.bp ? 'Yes' : 'No'}</p>
                      {patientDetails.bp && patientDetails.bp_level && (
                        <p className="text-sm text-gray-500">Level: {patientDetails.bp_level}</p>
                      )}
                    </div>
                    <div>
                      <Label>Cardiac</Label>
                      <p className="text-gray-700">{patientDetails.cardiac ? 'Yes' : 'No'}</p>
                      {patientDetails.cardiac && patientDetails.cardiac_info && (
                        <p className="text-sm text-gray-500">Info: {patientDetails.cardiac_info}</p>
                      )}
                    </div>
                    <div>
                      <Label>Kidney</Label>
                      <p className="text-gray-700">{patientDetails.kidney ? 'Yes' : 'No'}</p>
                      {patientDetails.kidney && patientDetails.kidney_info && (
                        <p className="text-sm text-gray-500">Info: {patientDetails.kidney_info}</p>
                      )}
                    </div>
                    <div>
                      <Label>Liver</Label>
                      <p className="text-gray-700">{patientDetails.liver ? 'Yes' : 'No'}</p>
                      {patientDetails.liver && patientDetails.liver_info && (
                        <p className="text-sm text-gray-500">Info: {patientDetails.liver_info}</p>
                      )}
                    </div>
                    <div>
                      <Label>Lungs</Label>
                      <p className="text-gray-700">{patientDetails.lungs ? 'Yes' : 'No'}</p>
                      {patientDetails.lungs && patientDetails.lungs_info && (
                        <p className="text-sm text-gray-500">Info: {patientDetails.lungs_info}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Lifestyle</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Smoke</Label>
                      <p className="text-gray-700">{patientDetails.smoke ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label>Alcohol</Label>
                      <p className="text-gray-700">{patientDetails.alcohol ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label>Currently in Treatment</Label>
                      <p className="text-gray-700">{patientDetails.in_treatment ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={createAdmission} 
                  disabled={loading} 
                  className="w-full mt-6"
                >
                  {loading ? "Creating Admission..." : "Admit Patient"}
                </Button>
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewAdmissionForm;
