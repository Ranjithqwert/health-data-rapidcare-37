
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import SideNav from "@/components/common/SideNav";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  requiredUserType: 'admin' | 'doctor' | 'hospital' | 'user';
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, requiredUserType }) => {
  const navigate = useNavigate();
  
  const isLoggedIn = authService.isLoggedIn();
  const userType = authService.getUserType();
  
  useEffect(() => {
    // Check if token is present but user is not logged in or user type doesn't match
    if (!isLoggedIn || userType !== requiredUserType) {
      navigate("/");
    }
  }, [isLoggedIn, userType, navigate, requiredUserType]);
  
  if (!isLoggedIn || userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex">
      <SideNav userType={requiredUserType} />
      <main className="page-container flex-1">
        {children}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
