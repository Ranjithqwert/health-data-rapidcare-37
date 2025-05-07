
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import UserManagement from "@/components/admin/users/UserManagement";

const Users: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="admin">
      <div className="p-6">
        <UserManagement />
      </div>
    </AuthenticatedLayout>
  );
};

export default Users;
