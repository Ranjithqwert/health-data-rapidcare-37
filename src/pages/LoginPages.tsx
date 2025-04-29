
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/login/LoginForm";

// Admin Login Page
export const AdminLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-rapidcare-primary hover:underline">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Link>
        </div>
        
        <LoginForm userType="admin" title="Admin Login" />
      </div>
    </div>
  );
};

// Doctor Login Page
export const DoctorLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-rapidcare-primary hover:underline">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Link>
        </div>
        
        <LoginForm userType="doctor" title="Doctor Login" />
      </div>
    </div>
  );
};

// Hospital Login Page
export const HospitalLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-rapidcare-primary hover:underline">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Link>
        </div>
        
        <LoginForm userType="hospital" title="Hospital Login" />
      </div>
    </div>
  );
};

// User Login Page
export const UserLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-rapidcare-primary hover:underline">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Link>
        </div>
        
        <LoginForm userType="user" title="User Login" />
      </div>
    </div>
  );
};
