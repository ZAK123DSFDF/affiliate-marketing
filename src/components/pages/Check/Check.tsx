// components/pages/Check/Check.tsx
"use client";

import React, { useState } from "react";
import { fetchData, logMessage, saveToDB } from "@/app/check/checkActions";

const Check = () => {
  const [data, setData] = useState("");

  const handleLog = async () => {
    await logMessage();
  };

  const handleSave = async () => {
    await saveToDB("Sample data");
  };

  const handleFetch = async () => {
    const result = await fetchData();
    setData(result);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleLog}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log Message
      </button>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save Data
      </button>

      <button
        onClick={handleFetch}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Fetch Data
      </button>

      {data && <p>Received: {data}</p>}
    </div>
  );
};

export default Check;
