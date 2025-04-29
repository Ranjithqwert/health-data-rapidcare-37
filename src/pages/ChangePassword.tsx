
import React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import ChangePasswordForm from "@/components/common/ChangePasswordForm";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";

interface ChangePasswordPageProps {
  userType: 'admin' | 'doctor' | 'hospital' | 'user';
}

const ChangePassword: React.FC<ChangePasswordPageProps> = ({ userType }) => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Redirect to home page based on user type after password change
    switch (userType) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/home');
        break;
      case 'hospital':
        navigate('/hospital/home');
        break;
      case 'user':
        navigate('/user/home');
        break;
    }
  };
  
  return (
    <AuthenticatedLayout requiredUserType={userType}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Change Password</h1>
        <div className="bg-white rounded-lg shadow">
          <ChangePasswordForm onSuccess={handleSuccess} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ChangePassword;

export const AdminChangePassword: React.FC = () => (
  <ChangePassword userType="admin" />
);

export const DoctorChangePassword: React.FC = () => (
  <ChangePassword userType="doctor" />
);

export const HospitalChangePassword: React.FC = () => (
  <ChangePassword userType="hospital" />
);

export const UserChangePassword: React.FC = () => (
  <ChangePassword userType="user" />
);
