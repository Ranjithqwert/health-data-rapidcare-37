
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { authService } from "@/services/auth.service";
import { Hospital } from "@/models/models";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const HospitalHome: React.FC = () => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const hospitalId = authService.getUserId();
        if (hospitalId) {
          const { data, error } = await supabase
            .from('hospitals')
            .select('*')
            .eq('id', hospitalId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            // Transform the data to match our Hospital model
            const transformedHospital: Hospital = {
              hospitalId: data.id,
              hospitalName: data.name,
              emailId: data.email,
              mobile: data.mobile, // Fixed: using mobile instead of mobile_number
              hospitalLicenseNumber: data.license_number,
              hospitalHouseNumber: data.house_number || '',
              hospitalStreet: data.street || '',
              hospitalVillage: data.village || '',
              hospitalDistrict: data.district || '',
              hospitalState: data.state || '',
              hospitalCountry: data.country || '',
              hospitalPincode: data.pincode || '',
              type: data.type || 'general',
              speciality: data.speciality,
              numberOfICUs: data.number_of_icus || 0,
              numberOfOPRooms: data.number_of_op_rooms || 0,
              numberOfDoctors: data.number_of_doctors || 0,
              password: '********' // Masking the password
            };
            
            setHospital(transformedHospital);
          }
        }
      } catch (error) {
        console.error("Error fetching hospital details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch hospital details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHospitalDetails();
  }, []);
  
  if (loading) {
    return (
      <AuthenticatedLayout requiredUserType="hospital">
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
  
  if (!hospital) {
    return (
      <AuthenticatedLayout requiredUserType="hospital">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Failed to load hospital details. Please try again later.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
  
  return (
    <AuthenticatedLayout requiredUserType="hospital">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-rapidcare-primary mb-4">Hospital Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700">Basic Details</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Hospital ID:</span> {hospital.hospitalId}</p>
                  <p><span className="font-medium">Name:</span> {hospital.hospitalName}</p>
                  <p><span className="font-medium">Email:</span> {hospital.emailId}</p>
                  <p><span className="font-medium">Mobile Number:</span> {hospital.mobile}</p>
                  <p><span className="font-medium">License Number:</span> {hospital.hospitalLicenseNumber}</p>
                  <p><span className="font-medium">Type:</span> {hospital.type}</p>
                  {hospital.type === 'specialty' && <p><span className="font-medium">Speciality:</span> {hospital.speciality}</p>}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Facilities</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Number of ICUs:</span> {hospital.numberOfICUs}</p>
                  <p><span className="font-medium">Number of OP Rooms:</span> {hospital.numberOfOPRooms}</p>
                  <p><span className="font-medium">Number of Doctors:</span> {hospital.numberOfDoctors}</p>
                </div>
                
                <h3 className="font-medium text-gray-700 mt-4">Address</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">House Number:</span> {hospital.hospitalHouseNumber}</p>
                  <p><span className="font-medium">Street:</span> {hospital.hospitalStreet}</p>
                  <p><span className="font-medium">Village:</span> {hospital.hospitalVillage}</p>
                  <p><span className="font-medium">District:</span> {hospital.hospitalDistrict}</p>
                  <p><span className="font-medium">State:</span> {hospital.hospitalState}</p>
                  <p><span className="font-medium">Country:</span> {hospital.hospitalCountry}</p>
                  <p><span className="font-medium">PIN Code:</span> {hospital.hospitalPincode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default HospitalHome;
