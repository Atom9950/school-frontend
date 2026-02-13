import { useGuestMode } from "@/lib/use-guest-mode";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { disableGuestMode } from "@/lib/guest-mode";

interface GuestActionGuardProps {
  action: "create" | "edit" | "delete";
  children: React.ReactNode;
}

export function GuestActionGuard({ action, children }: GuestActionGuardProps) {
  const { isGuest } = useGuestMode();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (isGuest) {
      setShowDialog(true);
    }
  }, [isGuest]);

  if (!isGuest) {
    return <>{children}</>;
  }

  const actionText = {
    create: "create new items",
    edit: "edit items",
    delete: "delete items",
  }[action];

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Guest Access Limited
            </AlertDialogTitle>
            <AlertDialogDescription>
              Guest users cannot {actionText}. Sign up or sign in to get full access to manage the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                disableGuestMode();
                navigate("/login");
              }}
            >
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Show a disabled state while dialog is open */}
      <div className="opacity-50 pointer-events-none">{children}</div>
    </>
  );
}
