
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  userType: 'doctor' | 'hospital' | 'user';
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose, userType }) => {
  const [step, setStep] = useState<'enterMobile' | 'enterOTP' | 'resetPassword'>('enterMobile');
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const handleSendOTP = async () => {
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter your mobile number",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First, get the user's ID from the mobile number
      let tableName: "doctors" | "hospitals" | "patients";
      let mobileField: string;
      
      switch (userType) {
        case 'doctor': 
          tableName = 'doctors'; 
          mobileField = 'mobile_number';
          break;
        case 'hospital': 
          tableName = 'hospitals'; 
          mobileField = 'mobile';
          break;
        case 'user': 
          tableName = 'patients'; 
          mobileField = 'mobile_number';
          break;
        default: 
          throw new Error('Invalid user type');
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .eq(mobileField, mobileNumber)
        .maybeSingle();
      
      if (error || !data) {
        console.error("Error fetching user ID:", error);
        toast({
          title: "Error",
          description: "User not found. Please check your mobile number.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setUserId(data.id);
      
      // Now send the OTP
      const success = await authService.sendOTP(mobileNumber, userType);
      
      if (success) {
        setStep('enterOTP');
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
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
        setStep('resetPassword');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
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
        description: "Please enter and confirm your new password",
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
        toast({
          title: "Success",
          description: "Password has been reset successfully",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('enterMobile');
    setMobileNumber("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'enterMobile' ? 'Forgot Password' : 
             step === 'enterOTP' ? 'Enter OTP' : 'Reset Password'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'enterMobile' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <Input
                id="mobileNumber"
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full"
                disabled={loading}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 'enterOTP' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                className="w-full"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                An OTP has been sent to your registered email. Please check your inbox.
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 'resetPassword' && (
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
                placeholder="Enter your new password"
                className="w-full"
                disabled={loading}
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
                placeholder="Confirm your new password"
                className="w-full"
                disabled={loading}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleResetPassword} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
