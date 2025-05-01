
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import ChangePasswordForm from "@/components/common/ChangePasswordForm";

const UserChangePassword: React.FC = () => {
  return (
    <AuthenticatedLayout requiredUserType="user">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Change Password</h1>
        <ChangePasswordForm />
      </div>
    </AuthenticatedLayout>
  );
};

export default UserChangePassword;
