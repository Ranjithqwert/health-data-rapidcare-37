
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface IdDisplayDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userType: 'doctor' | 'hospital' | 'user';
  userName: string;
}

const IdDisplayDialog: React.FC<IdDisplayDialogProps> = ({
  open,
  onClose,
  userId,
  userType,
  userName
}) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(userId);
    toast({
      title: 'ID Copied',
      description: 'User ID has been copied to clipboard.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New {userType.charAt(0).toUpperCase() + userType.slice(1)} Created</DialogTitle>
          <DialogDescription>
            {userName} has been successfully created. Please save this ID for login purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-gray-50 border rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-lg font-mono font-bold">{userId}</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <p className="text-sm text-gray-500">
            Important: Save this ID. It's required for logging in to the system.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IdDisplayDialog;
