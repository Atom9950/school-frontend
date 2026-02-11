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
      
      // Try cookie-based session first (Better Auth default)
      let response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/get-session`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If cookies work, use that
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          // Store token if we got one in the response
          if (data?.session?.token) {
            localStorage.setItem("better_auth_token", data.session.token);
          }
          setSession(data);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: try token-based auth if we have a token
      if (token) {
        response = await fetch(
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

        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            setSession(data);
            setIsLoading(false);
            return;
          }
        }
      }

      // No valid session found
      localStorage.removeItem("better_auth_token");
      localStorage.removeItem("better_auth_session");
      setSession(null);
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