import { useSession } from "@/lib/auth-client";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give session a moment to load from storage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking session
  if (isPending || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Log for debugging
  if (error) {
    console.error("Session error:", error);
  }

  // Redirect to login if no session
  if (!session || error) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}