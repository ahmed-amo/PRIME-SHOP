import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { useAuth } from "@/contexts/authContext";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const { setToken } = useAuth();
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

    // Just set the token — authContext handles everything else
    setToken(token);

    // Give context time to fetch user then redirect
    setTimeout(() => {
      router.visit(route("shop"));
    }, 1000);
    // Intentionally once on mount; setToken is not stable across provider re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- OAuth callback: parse URL once
  }, []);

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
