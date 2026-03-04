import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function GoogleLoginButton({
  className = "",
  variant = "default",
  size = "default",
}: GoogleLoginButtonProps) {
  const handleGoogleLogin = () => {
    // Redirect to Laravel Google OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <Chrome className="h-5 w-5" />
      Continue with Google
    </Button>
  );
}
