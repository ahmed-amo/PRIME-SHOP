import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { useAuth } from "@/contexts/authContext";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const { setUser, setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const errorParam = url.searchParams.get("error");

    if (errorParam) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
      setTimeout(() => router.visit(route("login")), 3000);
      return;
    }

    if (!token) {
      setError("No authentication token received.");
      setLoading(false);
      setTimeout(() => router.visit(route("login")), 3000);
      return;
    }

    // Store token
    localStorage.setItem("auth_token", token);
    setToken(token);

    // Fetch user data
    axios
      .get("/api/user")
      .then((response) => {
        const user = response.data.user;
        setUser(user);
        setLoading(false);
        // Redirect to client dashboard
        router.visit(route("ClientHome"));
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data.");
        setLoading(false);
        localStorage.removeItem("auth_token");
        setTimeout(() => router.visit(route("login")), 3000);
      });
  }, [setUser, setToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium mb-2">Authentication Error</p>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-4">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
