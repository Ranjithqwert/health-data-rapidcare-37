
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  User
} from "lucide-react";

const Index: React.FC = () => {
  const LoginOption: React.FC<{
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = ({ to, icon, title, description }) => (
    <div className="w-full sm:w-1/2 md:w-1/4 p-3">
      <Link to={to}>
        <div className="bg-white h-full rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-rapidcare-light text-rapidcare-primary">
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-center text-rapidcare-primary mb-2">{title}</h3>
          <p className="text-sm text-center text-gray-500">{description}</p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="border-rapidcare-primary text-rapidcare-primary hover:bg-rapidcare-light">
              Login
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rapidcare-primary to-rapidcare-secondary py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
            RapidCare Health Systems
          </h1>
          <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Comprehensive healthcare management platform for patients, doctors, and hospitals
          </p>
        </div>
      </div>
      
      {/* Login Options */}
      <div className="flex-grow bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            Access Your Portal
          </h2>
          
          <div className="flex flex-wrap justify-center -m-3">
            <LoginOption
              to="/admin/login"
              icon={<ShieldCheck size={32} />}
              title="Admin Login"
              description="System administration and analytics dashboard"
            />
            
            <LoginOption
              to="/doctor/login"
              icon={<Stethoscope size={32} />}
              title="Doctor Login"
              description="Manage consultations and access patient records"
            />
            
            <LoginOption
              to="/hospital/login"
              icon={<Building2 size={32} />}
              title="Hospital Login"
              description="Manage admissions and hospital facilities"
            />
            
            <LoginOption
              to="/user/login"
              icon={<User size={32} />}
              title="User Login"
              description="Access your health records and history"
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">RapidCare Health Systems</h3>
              <p className="text-sm text-gray-400">Transforming healthcare management</p>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} RapidCare Health Systems. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
