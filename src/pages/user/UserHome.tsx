
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { apiService } from "@/services/api.service";
import { authService } from "@/services/auth.service";
import { User } from "@/models/models";
import { Skeleton } from "@/components/ui/skeleton";

const UserHome: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = authService.getUserId();
      if (userId) {
        const userData = await apiService.getUserDetails(userId);
        setUser(userData);
      }
      setLoading(false);
    };
    
    fetchUserDetails();
  }, []);
  
  if (loading) {
    return (
      <AuthenticatedLayout requiredUserType="user">
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
  
  if (!user) {
    return (
      <AuthenticatedLayout requiredUserType="user">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-500">Failed to load user details. Please try again later.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
  
  return (
    <AuthenticatedLayout requiredUserType="user">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-rapidcare-primary mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700">Basic Details</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">User ID:</span> {user.userId}</p>
                  <p><span className="font-medium">Name:</span> {user.name}</p>
                  <p><span className="font-medium">Age:</span> {user.age}</p>
                  <p><span className="font-medium">Date of Birth:</span> {user.dateOfBirth}</p>
                  <p><span className="font-medium">Mobile:</span> {user.mobileNumber}</p>
                  <p><span className="font-medium">Email:</span> {user.emailId}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Address</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">House Number:</span> {user.houseNumber}</p>
                  <p><span className="font-medium">Street:</span> {user.street}</p>
                  <p><span className="font-medium">Village:</span> {user.village}</p>
                  <p><span className="font-medium">District:</span> {user.district}</p>
                  <p><span className="font-medium">State:</span> {user.state}</p>
                  <p><span className="font-medium">Country:</span> {user.country}</p>
                  <p><span className="font-medium">PIN Code:</span> {user.pincode}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-rapidcare-primary mb-4">Health Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <h3 className="font-medium text-gray-700">Body Metrics</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Height:</span> {user.height} cm</p>
                  <p><span className="font-medium">Weight:</span> {user.weight} kg</p>
                  <p><span className="font-medium">BMI:</span> {user.bmi}</p>
                  <p><span className="font-medium">Obesity Level:</span> {user.obesityLevel}</p>
                </div>
              </div>
              
              <div className="col-span-2">
                <h3 className="font-medium text-gray-700">Medical Conditions</h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Sugar:</span> {user.sugar}</p>
                    {user.sugar === "Yes" && (
                      <p><span className="font-medium">Sugar Level:</span> {user.sugarLevel}</p>
                    )}
                  </div>
                  
                  <div>
                    <p><span className="font-medium">BP:</span> {user.bp}</p>
                    {user.bp === "Yes" && (
                      <p><span className="font-medium">BP Level:</span> {user.bpLevel}</p>
                    )}
                  </div>
                  
                  <div>
                    <p><span className="font-medium">Cardiac:</span> {user.cardiac}</p>
                    {user.cardiac === "Yes" && (
                      <p><span className="font-medium">Cardiac Info:</span> {user.cardiacInfo}</p>
                    )}
                  </div>
                  
                  <div>
                    <p><span className="font-medium">Kidney:</span> {user.kidney}</p>
                    {user.kidney === "Yes" && (
                      <p><span className="font-medium">Kidney Info:</span> {user.kidneyInfo}</p>
                    )}
                  </div>
                  
                  <div>
                    <p><span className="font-medium">Liver:</span> {user.liver}</p>
                    {user.liver === "Yes" && (
                      <p><span className="font-medium">Liver Info:</span> {user.liverInfo}</p>
                    )}
                  </div>
                  
                  <div>
                    <p><span className="font-medium">Lungs:</span> {user.lungs}</p>
                    {user.lungs === "Yes" && (
                      <p><span className="font-medium">Lungs Info:</span> {user.lungsInfo}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-700">Lifestyle</h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <p><span className="font-medium">Smoke:</span> {user.smoke}</p>
                <p><span className="font-medium">Alcohol:</span> {user.alcohol}</p>
                <p><span className="font-medium">In Treatment:</span> {user.inTreatment}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-rapidcare-primary mb-4">Account Information</h2>
            
            <div className="space-y-2">
              <p><span className="font-medium">Created Date:</span> {user.createdDate}/{user.createdMonth}/{user.createdYear}</p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default UserHome;
