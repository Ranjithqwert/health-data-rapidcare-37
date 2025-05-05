
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginFormProps {
  userType: 'admin' | 'doctor' | 'hospital' | 'user';
  title: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ userType, title }) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber || !password) {
      toast({
        title: "Error",
        description: "Please enter both mobile number and password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.loginWithMobile({
        mobileNumber,
        password,
        userType
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Login successful",
        });
        
        // Redirect based on user type
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
      } else {
        toast({
          title: "Error",
          description: response.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="form-container animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center text-rapidcare-primary">{title}</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              {userType === 'admin' ? 'Username' : 'Mobile Number'}
            </label>
            <Input
              id="mobileNumber"
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder={userType === 'admin' ? 'Enter your username' : 'Enter your mobile number'}
              className="login-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="login-input"
              required
            />
          </div>
          
          {userType !== 'admin' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-sm text-rapidcare-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
      
      {userType !== 'admin' && (
        <ForgotPasswordModal
          open={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
          userType={userType}
        />
      )}
    </div>
  );
};

export default LoginForm;
