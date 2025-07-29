import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InvalidToken = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-destructive">
              Invalid Token
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              The password reset link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default InvalidToken;
