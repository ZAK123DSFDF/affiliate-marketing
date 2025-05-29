// components/auth/GoogleAuthButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

interface GoogleAuthButtonProps {
  action: "login" | "signup";
  redirectTo?: string;
  buttonText?: string;
}

export const GoogleAuthButton = ({
  action = "login",
  redirectTo = "/dashboard",
  buttonText = "Continue with Google",
}: GoogleAuthButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      toast({
        title:
          action === "login" ? "Signed in successfully" : "Account created",
        description:
          action === "login"
            ? "Welcome back!"
            : "Your account has been created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: action === "login" ? "Sign in failed" : "Sign up failed",
        description: `Could not ${action} with Google`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <GoogleIcon className="w-4 h-4" />
          <span>{buttonText}</span>
        </>
      )}
    </Button>
  );
};
