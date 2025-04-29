
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Doctors: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div>
        <h1 className="text-2xl font-bold mb-6">Doctor Management</h1>
        <p>Doctor management functionality will be implemented here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Doctors;
