
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { apiService } from "@/services/api.service";
import { authService } from "@/services/auth.service";
import { Doctor } from "@/models/models";
import { Skeleton } from "@/components/ui/skeleton";

const DoctorHome: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const doctorId = authService.getUserId();
      if (doctorId) {
        const doctorData = await apiService.getDoctorDetails(doctorId);
        setDoctor(doctorData);
      }
      setLoading(false);
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
                  <p><span className="font-medium">Doctor ID:</span> {doctor.doctorId}</p>
                  <p><span className="font-medium">Name:</span> {doctor.name}</p>
                  <p><span className="font-medium">Date of Birth:</span> {doctor.dateOfBirth}</p>
                  <p><span className="font-medium">Mobile Number:</span> {doctor.mobileNumber}</p>
                  <p><span className="font-medium">Hospital:</span> {doctor.hospital}</p>
                  <p><span className="font-medium">Speciality:</span> {doctor.speciality}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Clinic Address</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">House Number:</span> {doctor.clinicHouseNumber}</p>
                  <p><span className="font-medium">Street:</span> {doctor.clinicStreet}</p>
                  <p><span className="font-medium">Village:</span> {doctor.clinicVillage}</p>
                  <p><span className="font-medium">District:</span> {doctor.clinicDistrict}</p>
                  <p><span className="font-medium">State:</span> {doctor.clinicState}</p>
                  <p><span className="font-medium">Country:</span> {doctor.clinicCountry}</p>
                  <p><span className="font-medium">PIN Code:</span> {doctor.clinicPincode}</p>
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
