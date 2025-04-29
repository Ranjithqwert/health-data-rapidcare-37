
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Consultations: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="doctor">
      <div>
        <h1 className="text-2xl font-bold mb-6">Consultations</h1>
        <p>Consultation management functionality will be implemented here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Consultations;
