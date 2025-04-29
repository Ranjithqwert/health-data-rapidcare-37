
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Admissions: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="hospital">
      <div>
        <h1 className="text-2xl font-bold mb-6">Admissions</h1>
        <p>Admission management functionality will be implemented here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Admissions;
