import { Navigate } from "react-router";
import { useAuth } from "@/lib/use-auth";
import { isGuestMode } from "@/lib/guest-mode";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading, error } = useAuth();
  const guestMode = isGuestMode();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session && !guestMode && error) {
    return <Navigate to="/login" replace />;
  }

  if (!session && !guestMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}