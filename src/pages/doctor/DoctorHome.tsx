
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { Doctor } from "@/models/models";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const DoctorHome: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorId = authService.getUserId();
        if (doctorId) {
          const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('id', doctorId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Transform the data to match our Doctor model
            const transformedDoctor: Doctor = {
              doctorId: data.id,
              name: data.name,
              mobileNumber: data.mobile_number || '',
              email: data.email || '',
              dateOfBirth: data.dob || '',
              hospital: data.hospital || '', // Using the correct field name
              speciality: data.speciality || '',
              clinicHouseNumber: data.clinic_house_number || '',
              clinicStreet: data.clinic_street || '',
              clinicVillage: data.clinic_village || '',
              clinicDistrict: data.clinic_district || '',
              clinicState: data.clinic_state || '',
              clinicCountry: data.clinic_country || '',
              clinicPincode: data.clinic_pincode || '',
              password: '********' // Masking the password
            };
            
            setDoctor(transformedDoctor);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch doctor details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctorDetails();
  }, []);
  
  if (loading) {
    return (
      <AuthenticatedLayout requiredUserType="doctor">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
  
  if (!doctor) {
    return (
      <AuthenticatedLayout requiredUserType="doctor">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Failed to load doctor details. Please try again later.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
  
  return (
    <AuthenticatedLayout requiredUserType="doctor">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-rapidcare-primary mb-4">Doctor Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700">Basic Details</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Doctor ID:</span> {doctor?.doctorId}</p>
                  <p><span className="font-medium">Name:</span> {doctor?.name}</p>
                  <p><span className="font-medium">Date of Birth:</span> {doctor?.dateOfBirth}</p>
                  <p><span className="font-medium">Mobile Number:</span> {doctor?.mobileNumber}</p>
                  <p><span className="font-medium">Email:</span> {doctor?.email}</p>
                  <p><span className="font-medium">Hospital:</span> {doctor?.hospital}</p>
                  <p><span className="font-medium">Speciality:</span> {doctor?.speciality}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Clinic Address</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">House Number:</span> {doctor?.clinicHouseNumber}</p>
                  <p><span className="font-medium">Street:</span> {doctor?.clinicStreet}</p>
                  <p><span className="font-medium">Village:</span> {doctor?.clinicVillage}</p>
                  <p><span className="font-medium">District:</span> {doctor?.clinicDistrict}</p>
                  <p><span className="font-medium">State:</span> {doctor?.clinicState}</p>
                  <p><span className="font-medium">Country:</span> {doctor?.clinicCountry}</p>
                  <p><span className="font-medium">PIN Code:</span> {doctor?.clinicPincode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default DoctorHome;
