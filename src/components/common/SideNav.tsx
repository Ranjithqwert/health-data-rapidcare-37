
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { LogOut, Key } from "lucide-react";

interface SideNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SideNavItem: React.FC<SideNavItemProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`nav-link ${isActive ? "active" : ""}`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </Link>
);

interface SideNavProps {
  userType: 'admin' | 'doctor' | 'hospital' | 'user';
}

const SideNav: React.FC<SideNavProps> = ({ userType }) => {
  const location = useLocation();
  const userName = authService.getUserName() || "";

  const getNavItems = () => {
    switch (userType) {
      case 'admin':
        return [
          { to: "/admin/dashboard", icon: <span className="material-icons">dashboard</span>, label: "Dashboard" },
          { to: "/admin/users", icon: <span className="material-icons">people</span>, label: "Users" },
          { to: "/admin/doctors", icon: <span className="material-icons">medical_services</span>, label: "Doctors" },
          { to: "/admin/hospitals", icon: <span className="material-icons">local_hospital</span>, label: "Hospitals" }
        ];
      case 'doctor':
        return [
          { to: "/doctor/home", icon: <span className="material-icons">home</span>, label: "Home" },
          { to: "/doctor/consultations", icon: <span className="material-icons">medical_information</span>, label: "Consultations" },
          { to: "/doctor/user-details", icon: <span className="material-icons">person_search</span>, label: "User Details" }
        ];
      case 'hospital':
        return [
          { to: "/hospital/home", icon: <span className="material-icons">home</span>, label: "Home" },
          { to: "/hospital/admissions", icon: <span className="material-icons">bed</span>, label: "Admissions" },
          { to: "/hospital/user-details", icon: <span className="material-icons">person_search</span>, label: "User Details" }
        ];
      case 'user':
        return [
          { to: "/user/home", icon: <span className="material-icons">home</span>, label: "Home" },
          { to: "/user/consultations", icon: <span className="material-icons">medical_information</span>, label: "Consultations" },
          { to: "/user/admissions", icon: <span className="material-icons">bed</span>, label: "Admissions" }
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="side-nav">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-rapidcare-primary">RapidCare</h2>
        <p className="text-sm text-gray-500 mt-1">
          {userName ? `Welcome, ${userName}` : `${userType.charAt(0).toUpperCase() + userType.slice(1)} Portal`}
        </p>
      </div>

      <div className="py-4">
        {getNavItems().map((item) => (
          <SideNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.to}
          />
        ))}
        
        <Link
          to={`/${userType}/change-password`}
          className={`nav-link ${location.pathname === `/${userType}/change-password` ? "active" : ""}`}
        >
          <Key size={20} />
          <span className="ml-3">Change Password</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full nav-link text-left"
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
