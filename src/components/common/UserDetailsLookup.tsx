
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/services/api.service";
import { User } from "@/models/models";
import { authService } from "@/services/auth.service";

interface UserDetailsLookupProps {
  userType: 'doctor' | 'hospital';
}

const UserDetailsLookup: React.FC<UserDetailsLookupProps> = ({ userType }) => {
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'userId' | 'otp' | 'details'>('userId');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSendOtp = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter a User ID",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await apiService.forgotPassword({ 
        userId, 
        userType: "user" // We're not actually resetting a password, just using the OTP mechanism
      });
      
      if (response.success) {
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to the user's email for verification",
        });
        setStep('otp');
      } else {
        toast({
          title: "Error",
          description: response.error || "User not found",
          variant: "destructive",
        });
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
      const response = await apiService.verifyOtp({
        userId,
        otp,
        userType: "user"
      });
      
      if (response.success) {
        // Fetch user details
        const userDetails = await apiService.getUserDetails(userId);
        
        if (userDetails) {
          setUser(userDetails);
          setStep('details');
          setDialogOpen(true);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch user details",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Invalid OTP",
          variant: "destructive",
        });
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

  const handleReset = () => {
    setUserId("");
    setOtp("");
    setUser(null);
    setStep('userId');
    setDialogOpen(false);
  };

  const renderUserDetails = () => {
    if (!user) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Personal Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Age:</span> {user.age}</p>
              <p><span className="font-medium">Date of Birth:</span> {user.dateOfBirth}</p>
              <p><span className="font-medium">Mobile:</span> {user.mobileNumber}</p>
              <p><span className="font-medium">Email:</span> {user.emailId}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Health Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Height:</span> {user.height} cm</p>
              <p><span className="font-medium">Weight:</span> {user.weight} kg</p>
              <p><span className="font-medium">BMI:</span> {user.bmi}</p>
              <p><span className="font-medium">Obesity Level:</span> {user.obesityLevel}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">Medical Conditions</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Sugar:</span> {user.sugar}</p>
              {user.sugar === "Yes" && (
                <p><span className="font-medium">Sugar Level:</span> {user.sugarLevel}</p>
              )}
            </div>
            
            <div>
              <p><span className="font-medium">BP:</span> {user.bp}</p>
              {user.bp === "Yes" && (
                <p><span className="font-medium">BP Level:</span> {user.bpLevel}</p>
              )}
            </div>
            
            <div>
              <p><span className="font-medium">Cardiac:</span> {user.cardiac}</p>
              {user.cardiac === "Yes" && (
                <p><span className="font-medium">Cardiac Info:</span> {user.cardiacInfo}</p>
              )}
            </div>
            
            <div>
              <p><span className="font-medium">Kidney:</span> {user.kidney}</p>
              {user.kidney === "Yes" && (
                <p><span className="font-medium">Kidney Info:</span> {user.kidneyInfo}</p>
              )}
            </div>
            
            <div>
              <p><span className="font-medium">Liver:</span> {user.liver}</p>
              {user.liver === "Yes" && (
                <p><span className="font-medium">Liver Info:</span> {user.liverInfo}</p>
              )}
            </div>
            
            <div>
              <p><span className="font-medium">Lungs:</span> {user.lungs}</p>
              {user.lungs === "Yes" && (
                <p><span className="font-medium">Lungs Info:</span> {user.lungsInfo}</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700">Lifestyle</h3>
          <div className="mt-2 space-y-2">
            <p><span className="font-medium">Smoke:</span> {user.smoke}</p>
            <p><span className="font-medium">Alcohol:</span> {user.alcohol}</p>
            <p><span className="font-medium">In Treatment:</span> {user.inTreatment}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 'userId':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter User ID
              </label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
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
        );
      
      case 'otp':
        return (
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
                placeholder="Enter the OTP"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The OTP has been sent to the user's email address.
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
                onClick={handleSendOtp}
                className="text-sm text-rapidcare-primary hover:underline"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send New OTP"}
              </button>
            </div>
          </div>
        );
      
      case 'details':
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">User ID: {userId}</h2>
              <Button onClick={() => setDialogOpen(true)}>
                View Details
              </Button>
            </div>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="w-full"
            >
              Look Up Another User
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-rapidcare-primary">User Details Lookup</h2>
      
      {renderStepContent()}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details: {user?.name}</DialogTitle>
          </DialogHeader>
          
          {renderUserDetails()}
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetailsLookup;
