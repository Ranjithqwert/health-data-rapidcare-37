
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import SideNav from "@/components/common/SideNav";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  requiredUserType: 'admin' | 'doctor' | 'hospital' | 'user';
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, requiredUserType }) => {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
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
    <div className="flex h-screen">
      <SideNav 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />
      
      <div className="md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 hidden">
        {/* Desktop Sidebar */}
        <div className="md:flex md:flex-col md:flex-grow md:bg-white md:border-r md:border-gray-200">
          <SideNav 
            isMobileSidebarOpen={isMobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />
        </div>
      </div>
      
      <main className="flex-1 overflow-auto bg-gray-50 md:ml-64">
        <div className="page-container p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
