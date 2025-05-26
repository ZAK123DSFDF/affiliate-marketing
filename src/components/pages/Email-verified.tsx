import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const EmailVerified = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Email Verified!
        </h1>

        <p className="text-gray-600">
          Your email address has been successfully verified. You can now access
          all features.
        </p>

        <Link href="/dashboard" className="w-full block">
          <Button className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmailVerified;
