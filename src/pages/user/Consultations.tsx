
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Consultations: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="user">
      <div>
        <h1 className="text-2xl font-bold mb-6">My Consultations</h1>
        <p>Consultation history will be displayed here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Consultations;
