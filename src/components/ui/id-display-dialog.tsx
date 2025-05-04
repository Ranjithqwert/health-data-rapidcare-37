
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Copy, Check } from "lucide-react";

interface IdDisplayDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  userId: string;
  password?: string;
  userType: "user" | "doctor" | "hospital";
}

export const IdDisplayDialog: React.FC<IdDisplayDialogProps> = ({
  open,
  onClose,
  title,
  userId,
  password,
  userType
}) => {
  const [copyStatus, setCopyStatus] = React.useState<{[key: string]: boolean}>({
    userId: false,
    password: false
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [field]: true });
    
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [field]: false });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border rounded-lg bg-gray-50 mt-4 space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-gray-500">User ID</div>
            <div className="flex items-center justify-between">
              <div className="font-medium">{userId}</div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => copyToClipboard(userId, 'userId')}
                title="Copy to clipboard"
              >
                {copyStatus.userId ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {password && (
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Password</div>
              <div className="flex items-center justify-between">
                <div className="font-medium">{password}</div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(password, 'password')}
                  title="Copy to clipboard"
                >
                  {copyStatus.password ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <Card className="bg-blue-50 p-4 border-blue-200">
          <p className="text-sm text-blue-700">
            Please save these credentials. You will need them to log in to the system.
            {userType === "user" && " For patients, this ID will be required during consultations and hospital admissions."}
          </p>
        </Card>
        
        <DialogFooter className="sm:justify-end mt-4">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IdDisplayDialog;
