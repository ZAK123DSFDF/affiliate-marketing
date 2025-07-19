"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  value: string;
  className?: string;
};

export const CopyButton = ({ value, className }: Props) => {
  const { toast } = useToast();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error copying",
      });
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size="icon"
      variant="ghost"
      className={className}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
};
