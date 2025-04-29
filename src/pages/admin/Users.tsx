
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Users: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div>
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <p>User management functionality will be implemented here.</p>
      </div>
    </AuthenticatedLayout>
  );
};

export default Users;
