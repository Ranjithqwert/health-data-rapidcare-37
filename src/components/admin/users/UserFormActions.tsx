
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UserFormActionsProps {
  activeTab: string;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  dialogMode: "create" | "edit";
  sendingEmail: boolean;
}

const UserFormActions: React.FC<UserFormActionsProps> = ({
  activeTab,
  onPreviousClick,
  onNextClick,
  onCancel,
  onSubmit,
  dialogMode,
  sendingEmail
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
      <div className="flex-1 flex justify-start">
        {activeTab !== "basic" && (
          <Button variant="outline" onClick={onPreviousClick}>
            Previous
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {activeTab !== "lifestyle" ? (
          <Button onClick={onNextClick}>
            Next
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={sendingEmail}>
            {sendingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Email...
              </>
            ) : dialogMode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFormActions;
