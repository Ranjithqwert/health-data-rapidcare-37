
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { User } from "@/models/models";
import { booleanToYesNo } from "@/utils/email-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCheck, FileText } from "lucide-react";
import UserReportsViewer from "./UserReportsViewer";

interface UserDetailsLookupProps {
  userType: 'doctor' | 'hospital';
}

const UserDetailsLookup: React.FC<UserDetailsLookupProps> = ({ userType }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);

  const handleLookup = async () => {
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUser(null);
    setConsultations([]);
    setAdmissions([]);

    try {
      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Transform DB data to User model
      const transformedUser: User = {
        userId: userData.id,
        name: userData.name,
        mobileNumber: userData.mobile_number,
        emailId: userData.email,
        dateOfBirth: userData.dob,
        age: userData.age || 0,
        sugar: booleanToYesNo(userData.sugar),
        sugarLevel: userData.sugar_level,
        bp: booleanToYesNo(userData.bp),
        bpLevel: userData.bp_level,
        cardiac: booleanToYesNo(userData.cardiac),
        cardiacInfo: userData.cardiac_info,
        kidney: booleanToYesNo(userData.kidney),
        kidneyInfo: userData.kidney_info,
        liver: booleanToYesNo(userData.liver),
        liverInfo: userData.liver_info,
        lungs: booleanToYesNo(userData.lungs),
        lungsInfo: userData.lungs_info,
        smoke: booleanToYesNo(userData.smoke),
        alcohol: booleanToYesNo(userData.alcohol),
        inTreatment: booleanToYesNo(userData.in_treatment),
        height_cm: userData.height_cm || 0,
        weight_kg: userData.weight_kg || 0,
        bmi: userData.bmi || 0,
        obesityLevel: userData.obesity_level as "Low" | "Correct" | "High" || "Correct",
        houseNumber: userData.house_number || "",
        street: userData.street || "",
        village: userData.village || "",
        district: userData.district || "",
        state: userData.state || "",
        country: userData.country || "",
        pincode: userData.pincode || "",
        password: "********", // Mask the password
        createdDate: userData.created_date || "",
        createdMonth: userData.created_month || "",
        createdYear: userData.created_year || "",
      };

      setUser(transformedUser);

      // Get consultations if available
      const { data: consultationsData } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', userId);
      
      if (consultationsData) {
        setConsultations(consultationsData);
      }

      // Get admissions if available
      const { data: admissionsData } = await supabase
        .from('admissions')
        .select('*')
        .eq('patient_id', userId);
      
      if (admissionsData) {
        setAdmissions(admissionsData);
      }
    } catch (error) {
      console.error("Error in user lookup:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Enter 10-digit User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleLookup}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      )}

      {user && (
        <ScrollArea className="h-[70vh]">
          <div className="space-y-6 pr-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Patient Information</span>
                  <Badge>{user.userId}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Personal Details</h3>
                      <div className="mt-2 space-y-1">
                        <p><span className="font-medium">Name:</span> {user.name}</p>
                        <p><span className="font-medium">Age:</span> {user.age}</p>
                        <p><span className="font-medium">Date of Birth:</span> {user.dateOfBirth}</p>
                        <p><span className="font-medium">Mobile:</span> {user.mobileNumber}</p>
                        <p><span className="font-medium">Email:</span> {user.emailId}</p>
                        <p><span className="font-medium">Currently In Treatment:</span> {user.inTreatment}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700">Address</h3>
                      <div className="mt-2 space-y-1">
                        <p>{user.houseNumber}, {user.street}</p>
                        <p>{user.village}, {user.district}</p>
                        <p>{user.state}, {user.country}</p>
                        <p>PIN: {user.pincode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Health Information</h3>
                      <div className="mt-2 space-y-1">
                        <p><span className="font-medium">Height:</span> {user.height_cm} cm</p>
                        <p><span className="font-medium">Weight:</span> {user.weight_kg} kg</p>
                        <p><span className="font-medium">BMI:</span> {user.bmi} ({user.obesityLevel})</p>
                        <p><span className="font-medium">Diabetes:</span> {user.sugar} {user.sugar === "Yes" ? `(${user.sugarLevel})` : ""}</p>
                        <p><span className="font-medium">Blood Pressure:</span> {user.bp} {user.bp === "Yes" ? `(${user.bpLevel})` : ""}</p>
                        <p><span className="font-medium">Cardiac Issues:</span> {user.cardiac} {user.cardiac === "Yes" ? `(${user.cardiacInfo})` : ""}</p>
                        <p><span className="font-medium">Kidney Issues:</span> {user.kidney} {user.kidney === "Yes" ? `(${user.kidneyInfo})` : ""}</p>
                        <p><span className="font-medium">Liver Issues:</span> {user.liver} {user.liver === "Yes" ? `(${user.liverInfo})` : ""}</p>
                        <p><span className="font-medium">Lungs Issues:</span> {user.lungs} {user.lungs === "Yes" ? `(${user.lungsInfo})` : ""}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700">Habits</h3>
                      <div className="mt-2 space-y-1">
                        <p><span className="font-medium">Smoking:</span> {user.smoke}</p>
                        <p><span className="font-medium">Alcohol:</span> {user.alcohol}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Records Section */}
            {user && <UserReportsViewer userId={user.userId} />}

            {/* Consultations */}
            <Card>
              <CardHeader>
                <CardTitle>Consultation History</CardTitle>
              </CardHeader>
              <CardContent>
                {consultations.length === 0 ? (
                  <p className="text-gray-500">No consultations found.</p>
                ) : (
                  <div className="space-y-4">
                    {consultations.map(consultation => (
                      <div key={consultation.id} className="border p-4 rounded-md">
                        <p><span className="font-medium">Date & Time:</span> {consultation.consultation_date} at {consultation.consultation_time}</p>
                        <p><span className="font-medium">Doctor:</span> {consultation.doctor_name}</p>
                        <p><span className="font-medium">Place:</span> {consultation.place} {consultation.place_id ? `(ID: ${consultation.place_id})` : ""}</p>
                        {consultation.prescription && <p><span className="font-medium">Prescription:</span> {consultation.prescription}</p>}
                        
                        {consultation.report_link && (
                          <p className="mt-2">
                            <a 
                              href={consultation.report_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Prescription Document
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admissions */}
            <Card>
              <CardHeader>
                <CardTitle>Hospital Admission History</CardTitle>
              </CardHeader>
              <CardContent>
                {admissions.length === 0 ? (
                  <p className="text-gray-500">No hospital admissions found.</p>
                ) : (
                  <div className="space-y-4">
                    {admissions.map(admission => (
                      <div key={admission.id} className="border p-4 rounded-md">
                        <p><span className="font-medium">Hospital:</span> {admission.hospital_name}</p>
                        <p><span className="font-medium">Admitted:</span> {admission.date_in} at {admission.time_in}</p>
                        {admission.date_out && <p><span className="font-medium">Discharged:</span> {admission.date_out} at {admission.time_out || "N/A"}</p>}
                        <p><span className="font-medium">Status:</span> {admission.discharged ? "Discharged" : "Admitted"}</p>
                        {admission.discharged && <p><span className="font-medium">Recovery Status:</span> {admission.recovered ? "Recovered" : "Under Treatment"}</p>}
                        {admission.feedback && <p><span className="font-medium">Feedback:</span> {admission.feedback}</p>}
                        
                        {admission.report_link && (
                          <p className="mt-2">
                            <a 
                              href={admission.report_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:underline"
                            >
                              <FileCheck className="h-4 w-4 mr-1" />
                              View Medical Report
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default UserDetailsLookup;
