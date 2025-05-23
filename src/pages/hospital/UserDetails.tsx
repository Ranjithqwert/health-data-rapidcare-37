
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import UserDetailsLookup from "@/components/common/UserDetailsLookup";

const UserDetails: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="hospital">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        <UserDetailsLookup userType="hospital" />
      </div>
    </AuthenticatedLayout>
  );
};

export default UserDetails;
