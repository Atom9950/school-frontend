import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { disableGuestMode } from "@/lib/guest-mode";

export function GuestBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">
            You're browsing as a guest. You can view the dashboard but cannot create or edit items.
          </p>
          <p className="text-xs text-amber-800 mt-1">
            Sign up or sign in to get full access and manage the system.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            disableGuestMode();
            navigate("/login");
          }}
        >
          Sign In
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-amber-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-amber-700" />
        </button>
      </div>
    </div>
  );
}
