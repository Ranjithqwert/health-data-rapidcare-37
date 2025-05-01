
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { 
  Home, 
  User, 
  Calendar, 
  FileText, 
  Bed, 
  LogOut,
  Settings,
  Users,
  Hospital,
  HeartPulse,
  BarChart
} from "lucide-react";

interface SideNavProps {
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (isOpen: boolean) => void;
}

const SideNav: React.FC<SideNavProps> = ({ isMobileSidebarOpen, setMobileSidebarOpen }) => {
  const location = useLocation();
  const userType = authService.getUserType();
  
  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };
  
  const menuClass = cn(
    "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform",
    isMobileSidebarOpen ? "transform-none" : "-translate-x-full lg:translate-x-0"
  );

  const linkClass = "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100";
  const activeLinkClass = "flex items-center p-2 text-white bg-rapidcare-primary rounded-lg";
  
  const getLinkClass = (path: string) => {
    return location.pathname === path ? activeLinkClass : linkClass;
  };
  
  const renderAdminMenu = () => (
    <>
      <li>
        <Link to="/admin/dashboard" className={getLinkClass("/admin/dashboard")} onClick={closeMobileSidebar}>
          <BarChart className="w-5 h-5 mr-2" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/admin/users" className={getLinkClass("/admin/users")} onClick={closeMobileSidebar}>
          <Users className="w-5 h-5 mr-2" />
          <span>Users</span>
        </Link>
      </li>
      <li>
        <Link to="/admin/doctors" className={getLinkClass("/admin/doctors")} onClick={closeMobileSidebar}>
          <HeartPulse className="w-5 h-5 mr-2" />
          <span>Doctors</span>
        </Link>
      </li>
      <li>
        <Link to="/admin/hospitals" className={getLinkClass("/admin/hospitals")} onClick={closeMobileSidebar}>
          <Hospital className="w-5 h-5 mr-2" />
          <span>Hospitals</span>
        </Link>
      </li>
    </>
  );
  
  const renderDoctorMenu = () => (
    <>
      <li>
        <Link to="/doctor/home" className={getLinkClass("/doctor/home")} onClick={closeMobileSidebar}>
          <Home className="w-5 h-5 mr-2" />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link to="/doctor/consultations" className={getLinkClass("/doctor/consultations")} onClick={closeMobileSidebar}>
          <Calendar className="w-5 h-5 mr-2" />
          <span>Consultations</span>
        </Link>
      </li>
      <li>
        <Link to="/doctor/user-details" className={getLinkClass("/doctor/user-details")} onClick={closeMobileSidebar}>
          <User className="w-5 h-5 mr-2" />
          <span>User Details</span>
        </Link>
      </li>
    </>
  );
  
  const renderHospitalMenu = () => (
    <>
      <li>
        <Link to="/hospital/home" className={getLinkClass("/hospital/home")} onClick={closeMobileSidebar}>
          <Home className="w-5 h-5 mr-2" />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link to="/hospital/admissions" className={getLinkClass("/hospital/admissions")} onClick={closeMobileSidebar}>
          <Bed className="w-5 h-5 mr-2" />
          <span>Admissions</span>
        </Link>
      </li>
      <li>
        <Link to="/hospital/user-details" className={getLinkClass("/hospital/user-details")} onClick={closeMobileSidebar}>
          <User className="w-5 h-5 mr-2" />
          <span>User Details</span>
        </Link>
      </li>
    </>
  );
  
  const renderUserMenu = () => (
    <>
      <li>
        <Link to="/user/home" className={getLinkClass("/user/home")} onClick={closeMobileSidebar}>
          <Home className="w-5 h-5 mr-2" />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link to="/user/consultations" className={getLinkClass("/user/consultations")} onClick={closeMobileSidebar}>
          <Calendar className="w-5 h-5 mr-2" />
          <span>Consultations</span>
        </Link>
      </li>
      <li>
        <Link to="/user/admissions" className={getLinkClass("/user/admissions")} onClick={closeMobileSidebar}>
          <Bed className="w-5 h-5 mr-2" />
          <span>Admissions</span>
        </Link>
      </li>
    </>
  );
  
  return (
    <aside className={menuClass}>
      <div className="overflow-y-auto py-5 px-3 h-full bg-white">
        <div className="flex items-center justify-center mb-5">
          <h1 className="text-2xl font-bold text-rapidcare-primary">RapidCare</h1>
        </div>
        <ul className="space-y-2">
          {userType === 'admin' && renderAdminMenu()}
          {userType === 'doctor' && renderDoctorMenu()}
          {userType === 'hospital' && renderHospitalMenu()}
          {userType === 'user' && renderUserMenu()}
          
          <li className="border-t border-gray-200 pt-2 mt-2">
            <Link to="/change-password" className={getLinkClass("/change-password")} onClick={closeMobileSidebar}>
              <Settings className="w-5 h-5 mr-2" />
              <span>Change Password</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={() => {
                authService.logout();
                closeMobileSidebar();
              }}
              className={linkClass}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideNav;
