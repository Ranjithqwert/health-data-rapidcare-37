
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import UserDetailsLookup from "@/components/common/UserDetailsLookup";

const UserDetails: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="doctor">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        <p className="mb-4 text-gray-600">
          Enter a patient's ID to view their details, medical history, and records.
        </p>
        <UserDetailsLookup userType="doctor" />
      </div>
    </AuthenticatedLayout>
  );
};

export default UserDetails;
