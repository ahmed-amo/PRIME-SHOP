import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

function GoogleIcon() {
  // Modern multicolor Google "G" logo
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.39 13.02 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.57-.14-3.08-.41-4.5H24v9h12.7c-.55 2.9-2.23 5.36-4.75 7.01l7.67 5.95C43.88 37.84 46.5 31.68 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.54 28.59A14.47 14.47 0 0 1 9.5 24c0-1.6.28-3.14.8-4.59l-7.98-6.19C.82 16.09 0 19.01 0 22c0 4.99 1.8 9.57 4.81 13.11l7.73-6.52z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.67-5.95C30.39 37.77 27.44 38.5 24 38.5c-6.26 0-11.61-3.52-14.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export default function GoogleLoginButton({
  className = "",
  size = "default",
}: GoogleLoginButtonProps) {
  const handleGoogleLogin = () => {
    const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
    const base =
      typeof fromEnv === "string" && fromEnv.trim() !== ""
        ? fromEnv.replace(/\/$/, "")
        : window.location.origin;
    window.location.href = `${base}/api/auth/google`;
  };

  return (
    <Button
  onClick={handleGoogleLogin}
  variant="default"
  size={size}
  className={`w-full justify-center bg-orange-500 text-white hover:bg-orange-600 border-orange-500 ${className}`}
>
  <span className="flex items-center gap-3">
    <span className="bg-white rounded-full p-[2px]">
      <GoogleIcon />
    </span>
    <span className="text-sm font-medium text-white">Continue with Google</span>
  </span>
</Button>
  );
}
