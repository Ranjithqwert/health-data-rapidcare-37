
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  userType: 'doctor' | 'hospital' | 'user';
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose, userType }) => {
  const [step, setStep] = useState<'userId' | 'otp' | 'reset'>('userId');
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter your ID",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await authService.sendOTP(userId, userType);
      if (success) {
        setStep('otp');
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await authService.verifyOTP(userId, otp, userType);
      if (success) {
        setStep('reset');
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please enter both password fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await authService.resetPassword({
        userId,
        newPassword,
        confirmPassword,
        userType
      });
      
      if (success) {
        handleClose();
        toast({
          title: "Success",
          description: "Password reset successfully. Please login with your new password.",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form after a delay to avoid flickering
    setTimeout(() => {
      setStep('userId');
      setUserId("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }, 300);
  };

  const handleSendNewOtp = async () => {
    setLoading(true);
    
    try {
      const success = await authService.sendOTP(userId, userType);
      if (success) {
        setOtp("");
      }
    } catch (error) {
      console.error("Send new OTP error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'userId':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Your {userType.charAt(0).toUpperCase() + userType.slice(1)} ID
                </label>
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={`Enter your ${userType} ID`}
                  required
                />
              </div>
              
              <Button 
                onClick={handleSendOtp} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          </>
        );
      
      case 'otp':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  OTP is valid for 10 minutes.
                </p>
              </div>
              
              <Button 
                onClick={handleVerifyOtp} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendNewOtp}
                  className="text-sm text-rapidcare-primary hover:underline"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send New OTP"}
                </button>
              </div>
            </div>
          </>
        );
      
      case 'reset':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              
              <Button 
                onClick={handleResetPassword} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'userId' && "Forgot Password"}
            {step === 'otp' && "Enter OTP"}
            {step === 'reset' && "Reset Password"}
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
