
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
  const [step, setStep] = useState<'enterMobile' | 'verifyVillage' | 'resetPassword'>('enterMobile');
  const [mobileNumber, setMobileNumber] = useState("");
  const [village, setVillage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const handleFindUser = async () => {
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
      setStep('verifyVillage');
    } catch (error) {
      console.error("Error finding user:", error);
      toast({
        title: "Error",
        description: "Failed to find user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVillage = async () => {
    if (!village) {
      toast({
        title: "Error",
        description: "Please enter your village name",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await authService.verifyVillage(userId, village, userType);
      
      if (success) {
        setStep('resetPassword');
      }
    } catch (error) {
      console.error("Error verifying village:", error);
      toast({
        title: "Error",
        description: "Failed to verify village name. Please try again.",
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
    setVillage("");
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
             step === 'verifyVillage' ? 'Verify Village' : 'Reset Password'}
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
              <Button type="button" onClick={handleFindUser} disabled={loading}>
                {loading ? "Finding..." : "Next"}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 'verifyVillage' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-1">
                Village Name
              </label>
              <Input
                id="village"
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Enter your village name for verification"
                className="w-full"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Please enter the village name you provided during registration for security verification.
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleVerifyVillage} disabled={loading}>
                {loading ? "Verifying..." : "Verify Village"}
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
