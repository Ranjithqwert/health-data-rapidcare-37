
import { useState } from 'react';
import IdDisplayDialog from '@/components/ui/id-display-dialog';

interface UseCredentialDisplayProps {
  userType: "user" | "doctor" | "hospital";
}

export const useCredentialDisplay = ({ userType }: UseCredentialDisplayProps) => {
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  
  const showCredentials = (id: string, pass: string) => {
    setUserId(id);
    setPassword(pass);
    setCredentialDialogOpen(true);
  };
  
  const hideCredentials = () => {
    setCredentialDialogOpen(false);
  };
  
  // Generate dialog title based on user type
  const getDialogTitle = () => {
    switch(userType) {
      case "user": 
        return "Patient Account Created";
      case "doctor":
        return "Doctor Account Created";
      case "hospital":
        return "Hospital Account Created";
      default:
        return "Account Created";
    }
  };
  
  const CredentialDialog = () => (
    <IdDisplayDialog
      open={credentialDialogOpen}
      onClose={hideCredentials}
      title={getDialogTitle()}
      userId={userId}
      password={password}
      userType={userType}
    />
  );
  
  return {
    showCredentials,
    hideCredentials,
    CredentialDialog
  };
};

export default useCredentialDisplay;
