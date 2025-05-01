import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Users, 
  Hospital, 
  FileText, 
  LogOut,
  Menu,
  X,
  Key  // Added Key icon for Change Password
} from "lucide-react";

interface SideNavProps {
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const SideNav = ({ isMobileSidebarOpen, setMobileSidebarOpen }: SideNavProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Get the current user type
  const userType = authService.getUserType();

  // Define navigation items based on user type
  const navItems: { label: string; path: string; icon: React.ReactNode }[] = [];

  if (userType === 'admin') {
    navItems.push({ label: 'Dashboard', path: '/admin/dashboard', icon: <Home className="h-5 w-5" /> });
    navItems.push({ label: 'Doctors', path: '/admin/doctors', icon: <Users className="h-5 w-5" /> });
    navItems.push({ label: 'Hospitals', path: '/admin/hospitals', icon: <Hospital className="h-5 w-5" /> });
    navItems.push({ label: 'Users', path: '/admin/users', icon: <User className="h-5 w-5" /> });
  } else if (userType === 'doctor') {
    navItems.push({ label: 'Home', path: '/doctor/home', icon: <Home className="h-5 w-5" /> });
    navItems.push({ label: 'Consultations', path: '/doctor/consultations', icon: <FileText className="h-5 w-5" /> });
    navItems.push({ label: 'User Details', path: '/doctor/user-details', icon: <User className="h-5 w-5" /> });
  } else if (userType === 'hospital') {
    navItems.push({ label: 'Home', path: '/hospital/home', icon: <Home className="h-5 w-5" /> });
    navItems.push({ label: 'Admissions', path: '/hospital/admissions', icon: <FileText className="h-5 w-5" /> });
    navItems.push({ label: 'User Details', path: '/hospital/user-details', icon: <User className="h-5 w-5" /> });
  } else if (userType === 'user') {
    navItems.push({ label: 'Home', path: '/user/home', icon: <Home className="h-5 w-5" /> });
    navItems.push({ label: 'Consultations', path: '/user/consultations', icon: <FileText className="h-5 w-5" /> });
    navItems.push({ label: 'Admissions', path: '/user/admissions', icon: <FileText className="h-5 w-5" /> });
  }

  // Add Change Password link to all user types
  if (userType === 'admin') {
    navItems.push({ 
      label: 'Change Password', 
      path: '/admin/change-password', 
      icon: <Key className="h-5 w-5" /> 
    });
  } else if (userType === 'doctor') {
    navItems.push({ 
      label: 'Change Password', 
      path: '/doctor/change-password', 
      icon: <Key className="h-5 w-5" /> 
    });
  } else if (userType === 'hospital') {
    navItems.push({ 
      label: 'Change Password', 
      path: '/hospital/change-password', 
      icon: <Key className="h-5 w-5" /> 
    });
  } else if (userType === 'user') {
    navItems.push({ 
      label: 'Change Password', 
      path: '/user/change-password', 
      icon: <Key className="h-5 w-5" /> 
    });
  }

  return (
    <div className="md:hidden">
      <Button variant="outline" size="icon" onClick={() => setMobileSidebarOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform transform-translate-x-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">RapidCare Health System</span>
          <Button variant="outline" size="icon" onClick={() => setMobileSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="py-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 hover:bg-gray-100",
                location.pathname === item.path ? "bg-gray-100 font-medium" : ""
              )}
              onClick={() => setMobileSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <Button 
            variant="ghost"
            className="w-full justify-start pl-4 mt-2"
            onClick={() => {
              authService.logout();
              setMobileSidebarOpen(false);
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </nav>
      </aside>
    </div>
  );
};

export default SideNav;
