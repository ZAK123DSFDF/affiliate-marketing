import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <p className="text-lg font-medium text-gray-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
