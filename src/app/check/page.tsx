// app/check/page.tsx
import React from "react";
import Check from "@/components/pages/Check/Check";

export default function CheckPage() {
  return (
    <div>
      <h1>Check Page</h1>
      {/* No props needed! Actions are imported directly in the Client Component */}
      <Check />
    </div>
  );
}
