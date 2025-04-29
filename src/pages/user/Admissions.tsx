
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Admissions: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="user">
      <div>
        <h1 className="text-2xl font-bold mb-6">My Admissions</h1>
        <p>Admission history will be displayed here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Admissions;
