import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;  // Add this
  name: string;
  image?: string | null;   // Add this
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem("better_auth_token");
      
      if (!token) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/get-session-with-token`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Session validation failed");
      }

      const data = await response.json();
      
      if (data && data.user) {
        setSession(data);
      } else {
        // Token invalid, clear it
        localStorage.removeItem("better_auth_token");
        localStorage.removeItem("better_auth_session");
        setSession(null);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setError(err as Error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isLoading,
    error,
    refetch: checkSession,
  };
}