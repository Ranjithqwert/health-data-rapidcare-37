import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLogin, DoctorLogin, HospitalLogin, UserLogin } from "./pages/LoginPages";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminDoctors from "./pages/admin/Doctors";
import AdminHospitals from "./pages/admin/Hospitals";
import { AdminChangePassword } from "./pages/ChangePassword";

// Doctor Pages
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorConsultations from "./pages/doctor/Consultations";
import DoctorUserDetails from "./pages/doctor/UserDetails";
import DoctorChangePassword from "./pages/doctor/ChangePassword";

// Hospital Pages
import HospitalHome from "./pages/hospital/HospitalHome";
import HospitalAdmissions from "./pages/hospital/Admissions";
import HospitalUserDetails from "./pages/hospital/UserDetails";
import HospitalChangePassword from "./pages/hospital/ChangePassword";

// User Pages
import UserHome from "./pages/user/UserHome";
import UserConsultations from "./pages/user/Consultations";
import UserAdmissions from "./pages/user/Admissions";
import UserChangePassword from "./pages/user/ChangePassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Index />} />
            
            {/* Login Pages */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/hospital/login" element={<HospitalLogin />} />
            <Route path="/user/login" element={<UserLogin />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/hospitals" element={<AdminHospitals />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/change-password" element={<AdminChangePassword />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/home" element={<DoctorHome />} />
            <Route path="/doctor/consultations" element={<DoctorConsultations />} />
            <Route path="/doctor/user-details" element={<DoctorUserDetails />} />
            <Route path="/doctor/change-password" element={<DoctorChangePassword />} />
            
            {/* Hospital Routes */}
            <Route path="/hospital/home" element={<HospitalHome />} />
            <Route path="/hospital/admissions" element={<HospitalAdmissions />} />
            <Route path="/hospital/user-details" element={<HospitalUserDetails />} />
            <Route path="/hospital/change-password" element={<HospitalChangePassword />} />
            
            {/* User Routes */}
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/consultations" element={<UserConsultations />} />
            <Route path="/user/admissions" element={<UserAdmissions />} />
            <Route path="/user/change-password" element={<UserChangePassword />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
