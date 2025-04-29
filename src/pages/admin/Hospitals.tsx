
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Hospitals: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div>
        <h1 className="text-2xl font-bold mb-6">Hospital Management</h1>
        <p>Hospital management functionality will be implemented here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Hospitals;
